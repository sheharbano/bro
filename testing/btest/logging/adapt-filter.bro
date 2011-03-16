
# @TEST-EXEC: bro %INPUT 
# @TEST-EXEC: btest-diff ssh-new-default.log
# @TEST-EXEC: test '!' -e ssh.log

module SSH;

@load logging

export {
	# Create a new ID for our log stream
	redef enum Log::ID += { SSH };

	# Define a record with all the columns the log file can have.
	# (I'm using a subset of fields from ssh-ext for demonstration.)
	type Log: record {
		t: time;
		id: conn_id; # Will be rolled out into individual columns.
		status: string &optional;
		country: string &default="unknown";
	};
}

event bro_init()
{
	Log::create_stream(SSH, [$columns=Log]);

	local filter = Log::get_filter(SSH, "default");
	filter$path= "ssh-new-default";
	Log::add_filter(SSH, filter);

    local cid = [$orig_h=1.2.3.4, $orig_p=1234/tcp, $resp_h=2.3.4.5, $resp_p=80/tcp];
	Log::write(SSH, [$t=network_time(), $id=cid, $status="success"]);
	Log::write(SSH, [$t=network_time(), $id=cid, $status="failure", $country="US"]);
}