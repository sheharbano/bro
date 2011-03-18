##! The logging this script does is primarily focused on logging FTP commands
##! along with metadata.  For example, if files are transferred, the argument
##! will take on the full path that the client is at along with the requested 
##! file name.  
##! 
##! TODO:
##!  * Handle encrypted sessions correctly (get an example?)
##!  * Detect client software with CLNT command
##!  * Detect server software with initial 220 message
##!  * Detect client software with password given for anonymous users 
##!    (e.g. cyberduck@example.net)

@load functions
@load notice
@load software
@load ftp-lib

module FTP;

redef enum Notice::Type += {
	## This indicates that a successful response to a "SITE EXEC" 
	## command/arg pair was seen.
	FTP_Site_Exec_Success,
};

redef enum Log::ID += { FTP };

# Configure DPD
const ports = { 21/tcp } &redef;
redef capture_filters += { ["ftp"] = "port 21" };
redef dpd_config += { [ANALYZER_FTP] = [$ports = ports] };


export {
	type LogTags: enum {
		UNKNOWN
	};
	
	type Log: record {
		ts:               time;
		id:               conn_id;
		user:             string &default="<unknown>";
		password:         string &optional;
		command:          string &default="";
		arg:              string &default="";
		mime_type:        string &default="";
		mime_desc:        string &default="";
		file_size:        count &default=0;
		reply_code:       count &default=0;
		reply_msg:        string &default="";
		tags:             set[LogTags];
	};
	
	type SessionInfo: record {
		log:                Log;
		## By setting the CWD to '/.', we can indicate that unless something
		## more concrete is discovered that the existing but unknown
		## directory is ok to use.
		cwd:                string &default="/.";
		command:            CmdArg &optional;
		pending_commands:   PendingCmds;
	};

	type ExpectedConn: record {
		host:    addr;
		session: SessionInfo;
	};
	
	## This record is to hold a parsed FTP reply code.  For example, for the 
	## 201 status code, the digits would be parsed as: x->2, y->0, z=>1.
	type ReplyCode: record {
		x: count;
		y: count;
		z: count;
	};

	# TODO: add this back in some form.  raise a notice again?
	#const excessive_filename_len = 250 &redef;
	#const excessive_filename_trunc_len = 32 &redef;

	## These are user IDs that can be considered "anonymous".
	const guest_ids = { "anonymous", "ftp", "guest" } &redef;
	
	## The list of commands that should have their command/response pairs logged.
	const logged_commands = {
		"APPE", "DELE", "RETR", "STOR", "STOU", "CLNT", "ACCT"
	} &redef;
	
	## This tracks all of the currently established FTP control sessions.
	global active_conns: table[conn_id] of SessionInfo &read_expire=5mins;
	
	global log_ftp: event(rec: Log);
}

global ftp_data_expected: table[addr, port] of ExpectedConn &create_expire=5mins;

event bro_init()
	{
	Log::create_stream(FTP, [$columns=FTP::Log, $ev=log_ftp]);
	Log::add_default_filter(FTP);
	}

# A set of commands where the argument can be expected to refer
# to a file or directory.
const file_cmds = {
	"APPE", "CWD", "DELE", "MKD", "RETR", "RMD", "RNFR", "RNTO",
	"STOR", "STOU", "REST", "SIZE", "MDTM",
};

# Commands that either display or change the current working directory.
const directory_cmds = {
	["CWD",  250],
	["CDUP", 200], # typo in RFC?
	["CDUP", 250], # as found in traces
	["PWD",  257],
	["XPWD", 257],
};

function parse_ftp_reply_code(code: count): ReplyCode
	{
	local a: ReplyCode;

	a$z = code % 10;

	code = code / 10;
	a$y = code % 10;

	code = code / 10;
	a$x = code % 10;

	return a;
	}

function get_ftp_session(c: connection): SessionInfo
	{
	local id = c$id;

	local info: SessionInfo;
	local tags: set[LogTags] = set();
	info$log = [$ts=network_time(), $id=c$id, $tags=tags];
	local cmds: table[count] of CmdArg = table();
	info$pending_commands = cmds;
	# Add a shim command so the server can respond with some init response.
	add_pending_cmd(info$pending_commands, "<init>", "");

	active_conns[id] = info;
	return info;
	}

function ftp_message(s: SessionInfo)
	{
	# If it either has a tag associated with it (something detected)
	# or it's a deliberately logged command.
	if ( |s$log$tags| > 0 || (s?$command && s$command$cmd in logged_commands) )
		{
		local pass = "\\N";
		if ( to_lower(s$log$user) in guest_ids && s$log?$password )
			pass = s$log$password;
	
		local arg = s$command$arg;
		if ( s$command$cmd in file_cmds )
			arg = fmt("ftp://%s%s", s$log$id$resp_h, absolute_path(s$cwd, arg));
		
		s$log$ts=s$command$ts;
		s$log$command=s$command$cmd;
		s$log$arg=arg;
		
		# TODO: does the framework do this atomicly or do I need the copy?
		Log::write(FTP, copy(s$log));
		}
	
	# The MIME and file_size fields are specific to file transfer commands 
	# and may not be used in all commands so they need reset to "blank" 
	# values after logging.
	# TODO: change these to blank or remove the field when moving to the new
	#       logging framework
	s$log$mime_type="\\N";
	s$log$mime_desc="\\N";
	s$log$file_size=0;
	s$log$tags=set();
	}

event ftp_request(c: connection, command: string, arg: string) &priority=1
	{
	# TODO: find out if this issue is fixed with DPD
	# Command may contain garbage, e.g. if we're parsing something
	# which isn't ftp. Ignore this.
	#if ( is_string_binary(command) ) return;

	local id = c$id;
	local session = get_ftp_session(c);

	# Log the previous command when a new command is seen.
	# The downside here is that commands definitely aren't logged until the
	# next command is issued or the control session ends.  In practicality
	# this isn't an issue, but I suppose it could be a delay tactic for
	# attackers.
	if ( session?$command && session$log$reply_code != 0 )
		{
		remove_pending_cmd(session$pending_commands, session$command);
		ftp_message(session);
		}
		
	# Queue up the new command and argument
	add_pending_cmd(session$pending_commands, command, arg);
	
	if ( command == "USER" )
		session$log$user = arg;
	
	else if ( command == "PASS" )
		session$log$password = arg;
	
	else if ( command == "PORT" || command == "EPRT" )
		{
		local data = (command == "PORT") ?
				parse_ftp_port(arg) : parse_eftp_port(arg);

		if ( data$valid )
			{
			local expected = [$host=c$id$resp_h, $session=session];
			ftp_data_expected[data$h, data$p] = expected;
			expect_connection(id$resp_h, data$h, data$p, ANALYZER_FILE, 5mins);
			}
		else
			{
			# TODO: raise a notice?  does anyone care?
			}
		}
	}


event ftp_reply(c: connection, code: count, msg: string, cont_resp: bool) &priority=1
	{
	# TODO: figure out what to do with continued FTP response (not used much)
	if ( cont_resp ) return;
	
	local id = c$id;
	local session = get_ftp_session(c);
	
	session$command = get_pending_cmd(session$pending_commands, code, msg);

	session$log$reply_code = code;
	session$log$reply_msg = msg;
	
	# TODO: do some sort of generic clear text login processing here.
	local response_xyz = parse_ftp_reply_code(code);
	#if ( response_xyz$x == 2 &&  # successful
	#     session$command$cmd == "PASS" )
	#	do_ftp_login(c, session);
	if ( session$command$cmd == "PASS" )
		print fmt("Woo: %s %s", session$log$user, session$log$password);

	if ( code == 150 && session$command$cmd == "RETR" )
		{
		local parts = split_all(msg, /\([0-9]+[[:blank:]]+/);
		if ( |parts| >= 3 )
			session$log$file_size = to_count(gsub(parts[2], /[^0-9]/, ""));
		}
	else if ( code == 213 && session$command$cmd == "SIZE" )
		{
		# NOTE: this isn't exactly the right thing to do here since the size
		#       on a different file could be checked, but the file size will
		#       be overwritten by the server response to the RETR command
		#       if that's given as well which would be more correct.
		session$log$file_size = to_count(msg);
		}
		
	# If a successful SITE EXEC command is executed, raise a notice.
	else if ( response_xyz$x == 2 &&
	          session$command$cmd == "SITE" && 
	          /[Ee][Xx][Ee][Cc]/ in session$command$arg )
		{
		NOTICE([$note=FTP_Site_Exec_Success, $conn=c,
		        $msg=fmt("%s %s", session$command$cmd, session$command$arg)]);
		}

	# PASV and EPSV processing
	else if ( (code == 227 || code == 229) &&
	     (session$command$cmd == "PASV" || session$command$cmd == "EPSV") )
		{
		local data = (code == 227) ? parse_ftp_pasv(msg) : parse_ftp_epsv(msg);
		
		if ( data$valid )
			{
			if ( code == 229 && data$h == 0.0.0.0 )
				data$h = id$resp_h;
			
			local expected = [$host=id$orig_h, $session=session];
			ftp_data_expected[data$h, data$p] = expected;
			expect_connection(id$orig_h, data$h, data$p, ANALYZER_FILE, 5mins);
			}
		else
			{
			# TODO: do something if there was a problem parsing the PASV message?
			}
		}

	if ( [session$command$cmd, code] in directory_cmds )
		{
		if ( session$command$cmd == "CWD" )
			session$cwd = build_full_path(session$cwd, session$command$arg);

		else if ( session$command$cmd == "CDUP" )
			session$cwd = cat(session$cwd, "/..");

		else if ( session$command$cmd == "PWD" || session$command$cmd == "XPWD" )
			session$cwd = extract_directory(msg);
		}
	
	# In case there are multiple commands queued, go ahead and remove the
	# command here and log because we can't do the normal processing pipeline 
	# to wait for a new command before logging the command/response pair.
	if ( |session$pending_commands| > 1 )
		{
		remove_pending_cmd(session$pending_commands, session$command);
		ftp_message(session);
		}
	}

# Use state remove event to cover connections terminated by RST.
event connection_state_remove(c: connection) &priority=1
	{
	local id = c$id;
	if ( id !in active_conns ) return;
	local session = active_conns[id];

	# NOTE: Only dealing with a single pending command here.
	#       Extra pending commands are ignored for now.
	if ( |session$pending_commands| > 0 )
		{
		pop_pending_cmd(session$pending_commands, 0, "<finish>");
		ftp_message(session);
		}

	delete active_conns[id];
	}
	
#event expected_connection_seen(c: connection, a: count) &priority=1
#	{
#	local id = c$id;
#	if ( [id$resp_h, id$resp_p] in ftp_data_expected )
#		add c$service["ftp-data"];
#	}

#event file_transferred(c: connection, prefix: string, descr: string,
#			mime_type: string) &priority=1
#	{
#	local id = c$id;
#	if ( [id$resp_h, id$resp_p] in ftp_data_expected )
#		{
#		local expected = ftp_data_expected[id$resp_h, id$resp_p];
#		local s = expected$session;
#		s$log$mime_type = mime_type;
#		s$log$mime_desc = descr;
#		
#		# TODO: not sure if it's ok to delete this here, but it should
#		#       always be called since the file analyzer is always attached
#		#       to ftp-data sessions.
#		delete ftp_data_expected[id$resp_h, id$resp_p];
#		}
#	}