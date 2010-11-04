%extern{
#include "NetVar.h"
%}

connection SMB_Conn(bro_analyzer: BroAnalyzer) {
	upflow = SMB_Flow(true);
	downflow = SMB_Flow(false);
};

flow SMB_Flow(is_orig: bool) {
	flowunit = SMB_PDU(is_orig) withcontext (connection, this);
	
	%member{
		//BroAnalyzer interp;
	%}
	
	%init{
		//interp = connection()->bro_analyzer();
	%}

	%cleanup{
	%}
	
	function BuildHeaderVal(hdr: SMB_Header): BroVal
		%{
		RecordVal* r = new RecordVal(smb_hdr);

		unsigned int status = 0;

		try
			{
			// FIXME: does this work?  We need to catch exceptions :-(
			// or use guard functions.
			status = ${hdr.status.status} ||
				    ${hdr.status.dos_error.error_class} << 24 ||
				    ${hdr.status.dos_error.error_class};
			}
		catch ( const binpac::Exception& )
			{ // do nothing
			}

		r->Assign(0, new Val(${hdr.command}, TYPE_COUNT));
		r->Assign(1, new Val(${status}, TYPE_COUNT));
		r->Assign(2, new Val(${hdr.flags}, TYPE_COUNT));
		r->Assign(3, new Val(${hdr.flags2}, TYPE_COUNT));
		r->Assign(4, new Val(${hdr.tid}, TYPE_COUNT));
		r->Assign(5, new Val(${hdr.pid}, TYPE_COUNT));
		r->Assign(6, new Val(${hdr.uid}, TYPE_COUNT));
		r->Assign(7, new Val(${hdr.mid}, TYPE_COUNT));

		return r;
		%}
	
	function proc_smb_message(header: SMB_Header, is_orig: bool, data: bytestring): bool
		%{
		StringVal *body = new StringVal(${data}.length(), (const char*) ${data}.begin());
		
		bro_event_smb_message(connection()->bro_analyzer(),
		                      connection()->bro_analyzer()->Conn(),
		                      BuildHeaderVal(header),
		                      is_orig,
		                      body);
		return true;
		%}
		
	function proc_smb_empty_response(header: SMB_Header): bool
		%{
		//printf("empty_response\n");
		return true;
		%}
	

	function proc_smb_create_directory_request(header: SMB_Header, val: SMB_create_directory_request): bool
		%{
		//printf("create_directory_request\n");
		return true;
		%}
	function proc_smb_create_directory_response(header: SMB_Header, val: SMB_create_directory_response): bool
		%{
		//printf("create_directory_response\n");
		return true;
		%}
	#function proc_smb_delete_directory_request(header: SMB_Header, val: SMB_delete_directory_request): bool
	#	%{
	#	printf("delete_directory_request\n");
	#	return true;
	#	%}
	#function proc_smb_delete_directory_response(header: SMB_Header, val: SMB_delete_directory_response): bool
	#	%{
	#	printf("delete_directory_response\n");
	#	return true;
	#	%}
	#function proc_smb_open_request(header: SMB_Header, val: SMB_open_request): bool
	#	%{
	#	printf("open_request\n");
	#	return true;
	#	%}
	#function proc_smb_open_response(header: SMB_Header, val: SMB_open_response): bool
	#	%{
	#	printf("open_response\n");
	#	return true;
	#	%}
	#function proc_smb_create_request(header: SMB_Header, val: SMB_create_request): bool
	#	%{
	#	printf("create_request\n");
	#	return true;
	#	%}
	#function proc_smb_create_response(header: SMB_Header, val: SMB_create_response): bool
	#	%{
	#	printf("create_response\n");
	#	return true;
	#	%}
	function proc_smb_close_request(header: SMB_Header, val: SMB_close_request): bool
		%{
		//printf("close_request\n");
		return true;
		%}
	#function proc_smb_flush_request(header: SMB_Header, val: SMB_flush_request): bool
	#	%{
	#	printf("flush_request\n");
	#	return true;
	#	%}
	#function proc_smb_flush_response(header: SMB_Header, val: SMB_flush_response): bool
	#	%{
	#	printf("flush_response\n");
	#	return true;
	#	%}
	#function proc_smb_delete_request(header: SMB_Header, val: SMB_delete_request): bool
	#	%{
	#	printf("delete_request\n");
	#	return true;
	#	%}
	#function proc_smb_delete_response(header: SMB_Header, val: SMB_delete_response): bool
	#	%{
	#	printf("delete_response\n");
	#	return true;
	#	%}
	#function proc_smb_rename_request(header: SMB_Header, val: SMB_rename_request): bool
	#	%{
	#	printf("rename_request\n");
	#	return true;
	#	%}
	#function proc_smb_rename_response(header: SMB_Header, val: SMB_rename_response): bool
	#	%{
	#	printf("rename_response\n");
	#	return true;
	#	%}
	#function proc_smb_query_information_request(header: SMB_Header, val: SMB_query_information_request): bool
	#	%{
	#	printf("query_information_request\n");
	#	return true;
	#	%}
	#function proc_smb_query_information_response(header: SMB_Header, val: SMB_query_information_response): bool
	#	%{
	#	printf("query_information_response\n");
	#	return true;
	#	%}
	#function proc_smb_set_information_request(header: SMB_Header, val: SMB_set_information_request): bool
	#	%{
	#	printf("set_information_request\n");
	#	return true;
	#	%}
	#function proc_smb_set_information_response(header: SMB_Header, val: SMB_set_information_response): bool
	#	%{
	#	printf("set_information_response\n");
	#	return true;
	#	%}
	#function proc_smb_read_request(header: SMB_Header, val: SMB_read_request): bool
	#	%{
	#	printf("read_request\n");
	#	return true;
	#	%}
	#function proc_smb_read_response(header: SMB_Header, val: SMB_read_response): bool
	#	%{
	#	printf("read_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_request(header: SMB_Header, val: SMB_write_request): bool
	#	%{
	#	printf("write_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_response(header: SMB_Header, val: SMB_write_response): bool
	#	%{
	#	printf("write_response\n");
	#	return true;
	#	%}
	#function proc_smb_lock_byte_range_request(header: SMB_Header, val: SMB_lock_byte_range_request): bool
	#	%{
	#	printf("lock_byte_range_request\n");
	#	return true;
	#	%}
	#function proc_smb_lock_byte_range_response(header: SMB_Header, val: SMB_lock_byte_range_response): bool
	#	%{
	#	printf("lock_byte_range_response\n");
	#	return true;
	#	%}
	#function proc_smb_unlock_byte_range_request(header: SMB_Header, val: SMB_unlock_byte_range_request): bool
	#	%{
	#	printf("unlock_byte_range_request\n");
	#	return true;
	#	%}
	#function proc_smb_unlock_byte_range_response(header: SMB_Header, val: SMB_unlock_byte_range_response): bool
	#	%{
	#	printf("unlock_byte_range_response\n");
	#	return true;
	#	%}
	#function proc_smb_create_temporary_request(header: SMB_Header, val: SMB_create_temporary_request): bool
	#	%{
	#	printf("create_temporary_request\n");
	#	return true;
	#	%}
	#function proc_smb_create_temporary_response(header: SMB_Header, val: SMB_create_temporary_response): bool
	#	%{
	#	printf("create_temporary_response\n");
	#	return true;
	#	%}
	#function proc_smb_create_new_request(header: SMB_Header, val: SMB_create_new_request): bool
	#	%{
	#	printf("create_new_request\n");
	#	return true;
	#	%}
	#function proc_smb_create_new_response(header: SMB_Header, val: SMB_create_new_response): bool
	#	%{
	#	printf("create_new_response\n");
	#	return true;
	#	%}
	#function proc_smb_check_directory_request(header: SMB_Header, val: SMB_check_directory_request): bool
	#	%{
	#	printf("check_directory_request\n");
	#	return true;
	#	%}
	#function proc_smb_check_directory_response(header: SMB_Header, val: SMB_check_directory_response): bool
	#	%{
	#	printf("check_directory_response\n");
	#	return true;
	#	%}
	#function proc_smb_process_exit_request(header: SMB_Header, val: SMB_process_exit_request): bool
	#	%{
	#	printf("process_exit_request\n");
	#	return true;
	#	%}
	#function proc_smb_process_exit_response(header: SMB_Header, val: SMB_process_exit_response): bool
	#	%{
	#	printf("process_exit_response\n");
	#	return true;
	#	%}
	#function proc_smb_seek_request(header: SMB_Header, val: SMB_seek_request): bool
	#	%{
	#	printf("seek_request\n");
	#	return true;
	#	%}
	#function proc_smb_seek_response(header: SMB_Header, val: SMB_seek_response): bool
	#	%{
	#	printf("seek_response\n");
	#	return true;
	#	%}
	#function proc_smb_lock_and_read_request(header: SMB_Header, val: SMB_lock_and_read_request): bool
	#	%{
	#	printf("lock_and_read_request\n");
	#	return true;
	#	%}
	#function proc_smb_lock_and_read_response(header: SMB_Header, val: SMB_lock_and_read_response): bool
	#	%{
	#	printf("lock_and_read_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_and_unlock_request(header: SMB_Header, val: SMB_write_and_unlock_request): bool
	#	%{
	#	printf("write_and_unlock_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_and_unlock_response(header: SMB_Header, val: SMB_write_and_unlock_response): bool
	#	%{
	#	printf("write_and_unlock_response\n");
	#	return true;
	#	%}
	#function proc_smb_read_raw_request(header: SMB_Header, val: SMB_read_raw_request): bool
	#	%{
	#	printf("read_raw_request\n");
	#	return true;
	#	%}
	#function proc_smb_read_raw_response(header: SMB_Header, val: SMB_read_raw_response): bool
	#	%{
	#	printf("read_raw_response\n");
	#	return true;
	#	%}
	#function proc_smb_read_mpx_request(header: SMB_Header, val: SMB_read_mpx_request): bool
	#	%{
	#	printf("read_mpx_request\n");
	#	return true;
	#	%}
	#function proc_smb_read_mpx_response(header: SMB_Header, val: SMB_read_mpx_response): bool
	#	%{
	#	printf("read_mpx_response\n");
	#	return true;
	#	%}
	#function proc_smb_read_mpx_secondary_request(header: SMB_Header, val: SMB_read_mpx_secondary_request): bool
	#	%{
	#	printf("read_mpx_secondary_request\n");
	#	return true;
	#	%}
	#function proc_smb_read_mpx_secondary_response(header: SMB_Header, val: SMB_read_mpx_secondary_response): bool
	#	%{
	#	printf("read_mpx_secondary_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_raw_request(header: SMB_Header, val: SMB_write_raw_request): bool
	#	%{
	#	printf("write_raw_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_raw_response(header: SMB_Header, val: SMB_write_raw_response): bool
	#	%{
	#	printf("write_raw_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_mpx_request(header: SMB_Header, val: SMB_write_mpx_request): bool
	#	%{
	#	printf("write_mpx_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_mpx_response(header: SMB_Header, val: SMB_write_mpx_response): bool
	#	%{
	#	printf("write_mpx_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_mpx_secondary_request(header: SMB_Header, val: SMB_write_mpx_secondary_request): bool
	#	%{
	#	printf("write_mpx_secondary_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_mpx_secondary_response(header: SMB_Header, val: SMB_write_mpx_secondary_response): bool
	#	%{
	#	printf("write_mpx_secondary_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_complete_request(header: SMB_Header, val: SMB_write_complete_request): bool
	#	%{
	#	printf("write_complete_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_complete_response(header: SMB_Header, val: SMB_write_complete_response): bool
	#	%{
	#	printf("write_complete_response\n");
	#	return true;
	#	%}
	#function proc_smb_query_server_request(header: SMB_Header, val: SMB_query_server_request): bool
	#	%{
	#	printf("query_server_request\n");
	#	return true;
	#	%}
	#function proc_smb_query_server_response(header: SMB_Header, val: SMB_query_server_response): bool
	#	%{
	#	printf("query_server_response\n");
	#	return true;
	#	%}
	#function proc_smb_set_information2_request(header: SMB_Header, val: SMB_set_information2_request): bool
	#	%{
	#	printf("set_information2_request\n");
	#	return true;
	#	%}
	#function proc_smb_set_information2_response(header: SMB_Header, val: SMB_set_information2_response): bool
	#	%{
	#	printf("set_information2_response\n");
	#	return true;
	#	%}
	#function proc_smb_query_information2_request(header: SMB_Header, val: SMB_query_information2_request): bool
	#	%{
	#	printf("query_information2_request\n");
	#	return true;
	#	%}
	#function proc_smb_query_information2_response(header: SMB_Header, val: SMB_query_information2_response): bool
	#	%{
	#	printf("query_information2_response\n");
	#	return true;
	#	%}
	#function proc_smb_locking_andx_request(header: SMB_Header, val: SMB_locking_andx_request): bool
	#	%{
	#	printf("locking_andx_request\n");
	#	return true;
	#	%}
	#function proc_smb_locking_andx_response(header: SMB_Header, val: SMB_locking_andx_response): bool
	#	%{
	#	printf("locking_andx_response\n");
	#	return true;
	#	%}
	function proc_smb_transaction_request(header: SMB_Header, val: SMB_transaction_request): bool
		%{
		//printf("transaction_request\n");
		return true;
		%}
	function proc_smb_transaction_response(header: SMB_Header, val: SMB_transaction_response): bool
		%{
		//printf("transaction_response\n");
		return true;
		%}
	function proc_smb_transaction_secondary_request(header: SMB_Header, val: SMB_transaction_secondary_request): bool
		%{
		//printf("transaction_secondary_request\n");
		return true;
		%}
	#function proc_smb_ioctl_request(header: SMB_Header, val: SMB_ioctl_request): bool
	#	%{
	#	printf("ioctl_request\n");
	#	return true;
	#	%}
	#function proc_smb_ioctl_response(header: SMB_Header, val: SMB_ioctl_response): bool
	#	%{
	#	printf("ioctl_response\n");
	#	return true;
	#	%}
	#function proc_smb_ioctl_secondary_request(header: SMB_Header, val: SMB_ioctl_secondary_request): bool
	#	%{
	#	printf("ioctl_secondary_request\n");
	#	return true;
	#	%}
	#function proc_smb_ioctl_secondary_response(header: SMB_Header, val: SMB_ioctl_secondary_response): bool
	#	%{
	#	printf("ioctl_secondary_response\n");
	#	return true;
	#	%}
	#function proc_smb_copy_request(header: SMB_Header, val: SMB_copy_request): bool
	#	%{
	#	printf("copy_request\n");
	#	return true;
	#	%}
	#function proc_smb_copy_response(header: SMB_Header, val: SMB_copy_response): bool
	#	%{
	#	printf("copy_response\n");
	#	return true;
	#	%}
	#function proc_smb_move_request(header: SMB_Header, val: SMB_move_request): bool
	#	%{
	#	printf("move_request\n");
	#	return true;
	#	%}
	#function proc_smb_move_response(header: SMB_Header, val: SMB_move_response): bool
	#	%{
	#	printf("move_response\n");
	#	return true;
	#	%}
	#function proc_smb_echo_request(header: SMB_Header, val: SMB_echo_request): bool
	#	%{
	#	printf("echo_request\n");
	#	return true;
	#	%}
	#function proc_smb_echo_response(header: SMB_Header, val: SMB_echo_response): bool
	#	%{
	#	printf("echo_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_and_close_request(header: SMB_Header, val: SMB_write_and_close_request): bool
	#	%{
	#	printf("write_and_close_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_and_close_response(header: SMB_Header, val: SMB_write_and_close_response): bool
	#	%{
	#	printf("write_and_close_response\n");
	#	return true;
	#	%}
	#function proc_smb_open_andx_request(header: SMB_Header, val: SMB_open_andx_request): bool
	#	%{
	#	printf("open_andx_request\n");
	#	return true;
	#	%}
	#function proc_smb_open_andx_response(header: SMB_Header, val: SMB_open_andx_response): bool
	#	%{
	#	printf("open_andx_response\n");
	#	return true;
	#	%}
	function proc_smb_read_andx_request(header: SMB_Header, val: SMB_read_andx_request): bool
		%{
		//printf("read_andx_request\n");
		bro_event_smb_com_read_andx_request(connection()->bro_analyzer(),
		                                    connection()->bro_analyzer()->Conn(),
		                                    BuildHeaderVal(header),
		                                    (new Val(${val.file_id}, TYPE_COUNT))->AsCount());
		return true;
		%}
	function proc_smb_read_andx_response(header: SMB_Header, val: SMB_read_andx_response): bool
		%{
		//printf("read_andx_response\n");
		//StringVal *file_data = new StringVal(${val.data}.length(), (const char*) ${val.data}.begin());
		//bro_event_smb_com_read_andx_response(connection()->bro_analyzer(),
		//                                    connection()->bro_analyzer()->Conn(),
		//                                    BuildHeaderVal(header),
		//                                    file_data);
		return true;
		%}
	function proc_smb_write_andx_request(header: SMB_Header, val: SMB_write_andx_request): bool
		%{
		////printf("write_andx_request -- %d 0x%x\n", ${val.data_len}, ${val.file_id});
		//StringVal *file_data = new StringVal(${val.data}.length(), (const char*) ${val.data}.begin());
		//
		//bro_event_smb_com_write_andx_request(connection()->bro_analyzer(),
		//                                     connection()->bro_analyzer()->Conn(),
		//                                     BuildHeaderVal(header),
		//                                     file_data);
		//
		return true;
		%}
	function proc_smb_write_andx_response(header: SMB_Header, val: SMB_write_andx_response): bool
		%{
		//printf("write_andx_response\n");
		//bro_event_smb_com_write_andx_response(connection()->bro_analyzer(),
		//                                      connection()->bro_analyzer()->Conn(),
		//                                      BuildHeaderVal(header),
		//                                      (new Val(${val.written_bytes}, TYPE_COUNT))->AsCount());
		//
		return true;
		%}
	#function proc_smb_new_file_size_request(header: SMB_Header, val: SMB_new_file_size_request): bool
	#	%{
	#	printf("new_file_size_request\n");
	#	return true;
	#	%}
	#function proc_smb_new_file_size_response(header: SMB_Header, val: SMB_new_file_size_response): bool
	#	%{
	#	printf("new_file_size_response\n");
	#	return true;
	#	%}
	#function proc_smb_close_and_tree_disc_request(header: SMB_Header, val: SMB_close_and_tree_disc_request): bool
	#	%{
	#	printf("close_and_tree_disc_request\n");
	#	return true;
	#	%}
	#function proc_smb_close_and_tree_disc_response(header: SMB_Header, val: SMB_close_and_tree_disc_response): bool
	#	%{
	#	printf("close_and_tree_disc_response\n");
	#	return true;
	#	%}
	#function proc_smb_transaction2_request(header: SMB_Header, val: SMB_transaction2_request): bool
	#	%{
	#	printf("transaction2_request\n");
	#	return true;
	#	%}
	#function proc_smb_transaction2_response(header: SMB_Header, val: SMB_transaction2_response): bool
	#	%{
	#	printf("transaction2_response\n");
	#	return true;
	#	%}
	#function proc_smb_transaction2_secondary_request(header: SMB_Header, val: SMB_transaction2_secondary_request): bool
	#	%{
	#	printf("transaction2_secondary_request\n");
	#	return true;
	#	%}
	#function proc_smb_transaction2_secondary_response(header: SMB_Header, val: SMB_transaction2_secondary_response): bool
	#	%{
	#	printf("transaction2_secondary_response\n");
	#	return true;
	#	%}
	#function proc_smb_find_close2_request(header: SMB_Header, val: SMB_find_close2_request): bool
	#	%{
	#	printf("find_close2_request\n");
	#	return true;
	#	%}
	#function proc_smb_find_close2_response(header: SMB_Header, val: SMB_find_close2_response): bool
	#	%{
	#	printf("find_close2_response\n");
	#	return true;
	#	%}
	#function proc_smb_find_notify_close_request(header: SMB_Header, val: SMB_find_notify_close_request): bool
	#	%{
	#	printf("find_notify_close_request\n");
	#	return true;
	#	%}
	#function proc_smb_find_notify_close_response(header: SMB_Header, val: SMB_find_notify_close_response): bool
	#	%{
	#	printf("find_notify_close_response\n");
	#	return true;
	#	%}
	#function proc_smb_tree_connect_request(header: SMB_Header, val: SMB_tree_connect_request): bool
	#	%{
	#	printf("tree_connect_request\n");
	#	return true;
	#	%}
	#function proc_smb_tree_connect_response(header: SMB_Header, val: SMB_tree_connect_response): bool
	#	%{
	#	printf("tree_connect_response\n");
	#	return true;
	#	%}
	#function proc_smb_tree_disconnect_request(header: SMB_Header, val: SMB_tree_disconnect_request): bool
	#	%{
	#	printf("tree_disconnect_request\n");
	#	return true;
	#	%}
	#function proc_smb_tree_disconnect_response(header: SMB_Header, val: SMB_tree_disconnect_response): bool
	#	%{
	#	printf("tree_disconnect_response\n");
	#	return true;
	#	%}
	function proc_smb_negotiate_request(header: SMB_Header, val: SMB_negotiate_request): bool
		%{
		//printf("negotiate_request\n");
		return true;
		%}
	function proc_smb_negotiate_response(header: SMB_Header, val: SMB_negotiate_response): bool
		%{
		//printf("negotiate_response\n");
		return true;
		%}
	#function proc_smb_session_setup_andx_request(header: SMB_Header, val: SMB_session_setup_andx_request): bool
	#	%{
	#	printf("session_setup_andx_request\n");
	#	return true;
	#	%}
	#function proc_smb_session_setup_andx_response(header: SMB_Header, val: SMB_session_setup_andx_response): bool
	#	%{
	#	printf("session_setup_andx_response\n");
	#	return true;
	#	%}
	#function proc_smb_logoff_andx_request(header: SMB_Header, val: SMB_logoff_andx_request): bool
	#	%{
	#	printf("logoff_andx_request\n");
	#	return true;
	#	%}
	#function proc_smb_logoff_andx_response(header: SMB_Header, val: SMB_logoff_andx_response): bool
	#	%{
	#	printf("logoff_andx_response\n");
	#	return true;
	#	%}
	function proc_smb_tree_connect_andx_request(header: SMB_Header, val: SMB_tree_connect_andx_request): bool
		%{
		//printf("tree_connect_andx_request\n");
		return true;
		%}
	function proc_smb_tree_connect_andx_response(header: SMB_Header, val: SMB_tree_connect_andx_response): bool
		%{
		//printf("tree_connect_andx_response\n");
		return true;
		%}
	#function proc_smb_query_information_disk_request(header: SMB_Header, val: SMB_query_information_disk_request): bool
	#	%{
	#	printf("query_information_disk_request\n");
	#	return true;
	#	%}
	#function proc_smb_query_information_disk_response(header: SMB_Header, val: SMB_query_information_disk_response): bool
	#	%{
	#	printf("query_information_disk_response\n");
	#	return true;
	#	%}
	#function proc_smb_search_request(header: SMB_Header, val: SMB_search_request): bool
	#	%{
	#	printf("search_request\n");
	#	return true;
	#	%}
	#function proc_smb_search_response(header: SMB_Header, val: SMB_search_response): bool
	#	%{
	#	printf("search_response\n");
	#	return true;
	#	%}
	#function proc_smb_find_request(header: SMB_Header, val: SMB_find_request): bool
	#	%{
	#	printf("find_request\n");
	#	return true;
	#	%}
	#function proc_smb_find_response(header: SMB_Header, val: SMB_find_response): bool
	#	%{
	#	printf("find_response\n");
	#	return true;
	#	%}
	#function proc_smb_find_unique_request(header: SMB_Header, val: SMB_find_unique_request): bool
	#	%{
	#	printf("find_unique_request\n");
	#	return true;
	#	%}
	#function proc_smb_find_unique_response(header: SMB_Header, val: SMB_find_unique_response): bool
	#	%{
	#	printf("find_unique_response\n");
	#	return true;
	#	%}
	#function proc_smb_find_close_request(header: SMB_Header, val: SMB_find_close_request): bool
	#	%{
	#	printf("find_close_request\n");
	#	return true;
	#	%}
	#function proc_smb_find_close_response(header: SMB_Header, val: SMB_find_close_response): bool
	#	%{
	#	printf("find_close_response\n");
	#	return true;
	#	%}
	#function proc_smb_nt_transact_request(header: SMB_Header, val: SMB_nt_transact_request): bool
	#	%{
	#	printf("nt_transact_request\n");
	#	return true;
	#	%}
	#function proc_smb_nt_transact_response(header: SMB_Header, val: SMB_nt_transact_response): bool
	#	%{
	#	printf("nt_transact_response\n");
	#	return true;
	#	%}
	#function proc_smb_nt_transact_secondary_request(header: SMB_Header, val: SMB_nt_transact_secondary_request): bool
	#	%{
	#	printf("nt_transact_secondary_request\n");
	#	return true;
	#	%}
	#function proc_smb_nt_transact_secondary_response(header: SMB_Header, val: SMB_nt_transact_secondary_response): bool
	#	%{
	#	printf("nt_transact_secondary_response\n");
	#	return true;
	#	%}
	function proc_smb_nt_create_andx_request(header: SMB_Header, val: SMB_nt_create_andx_request): bool
		%{
		//printf("nt_create_andx_request\n");
		return true;
		%}
	function proc_smb_nt_create_andx_response(header: SMB_Header, val: SMB_nt_create_andx_response): bool
		%{
		//printf("nt_create_andx_response\n");
		return true;
		%}
	#function proc_smb_nt_cancel_request(header: SMB_Header, val: SMB_nt_cancel_request): bool
	#	%{
	#	printf("nt_cancel_request\n");
	#	return true;
	#	%}
	#function proc_smb_nt_cancel_response(header: SMB_Header, val: SMB_nt_cancel_response): bool
	#	%{
	#	printf("nt_cancel_response\n");
	#	return true;
	#	%}
	#function proc_smb_nt_rename_request(header: SMB_Header, val: SMB_nt_rename_request): bool
	#	%{
	#	printf("nt_rename_request\n");
	#	return true;
	#	%}
	#function proc_smb_nt_rename_response(header: SMB_Header, val: SMB_nt_rename_response): bool
	#	%{
	#	printf("nt_rename_response\n");
	#	return true;
	#	%}
	#function proc_smb_open_print_file_request(header: SMB_Header, val: SMB_open_print_file_request): bool
	#	%{
	#	printf("open_print_file_request\n");
	#	return true;
	#	%}
	#function proc_smb_open_print_file_response(header: SMB_Header, val: SMB_open_print_file_response): bool
	#	%{
	#	printf("open_print_file_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_print_file_request(header: SMB_Header, val: SMB_write_print_file_request): bool
	#	%{
	#	printf("write_print_file_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_print_file_response(header: SMB_Header, val: SMB_write_print_file_response): bool
	#	%{
	#	printf("write_print_file_response\n");
	#	return true;
	#	%}
	#function proc_smb_close_print_file_request(header: SMB_Header, val: SMB_close_print_file_request): bool
	#	%{
	#	printf("close_print_file_request\n");
	#	return true;
	#	%}
	#function proc_smb_close_print_file_response(header: SMB_Header, val: SMB_close_print_file_response): bool
	#	%{
	#	printf("close_print_file_response\n");
	#	return true;
	#	%}
	#function proc_smb_get_print_queue_request(header: SMB_Header, val: SMB_get_print_queue_request): bool
	#	%{
	#	printf("get_print_queue_request\n");
	#	return true;
	#	%}
	#function proc_smb_get_print_queue_response(header: SMB_Header, val: SMB_get_print_queue_response): bool
	#	%{
	#	printf("get_print_queue_response\n");
	#	return true;
	#	%}
	#function proc_smb_read_bulk_request(header: SMB_Header, val: SMB_read_bulk_request): bool
	#	%{
	#	printf("read_bulk_request\n");
	#	return true;
	#	%}
	#function proc_smb_read_bulk_response(header: SMB_Header, val: SMB_read_bulk_response): bool
	#	%{
	#	printf("read_bulk_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_bulk_request(header: SMB_Header, val: SMB_write_bulk_request): bool
	#	%{
	#	printf("write_bulk_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_bulk_response(header: SMB_Header, val: SMB_write_bulk_response): bool
	#	%{
	#	printf("write_bulk_response\n");
	#	return true;
	#	%}
	#function proc_smb_write_bulk_data_request(header: SMB_Header, val: SMB_write_bulk_data_request): bool
	#	%{
	#	printf("write_bulk_data_request\n");
	#	return true;
	#	%}
	#function proc_smb_write_bulk_data_response(header: SMB_Header, val: SMB_write_bulk_data_response): bool
	#	%{
	#	printf("write_bulk_data_response\n");
	#	return true;
	#	%}
	

	#function proc_smb_negotiate_response(header: SMB_Header, res: SMB_negotiate_response) : bool
	#	%{
	#	printf(" hey! %s - %d - %d hey!\n", (char*)${header.protocol}.begin(), ${header.process_id}, ${header.credit_charge});
	#	Val *credit_charge = new Val(${header.credit_charge}, TYPE_COUNT);
    #
	#	StringVal *cg = new StringVal(${res.server_guid}.length(), (const char*) ${res.server_guid}.begin());
	#	bro_event_smb_negotiate_response(connection()->bro_analyzer(),
	#					  connection()->bro_analyzer()->Conn(),
	#					  cg, credit_charge->AsCount());
	#	return true;
	#	%}
    #
	#function proc_smb_create_request(header: SMB_Header, val: SMB_create_request): bool
	#	%{
	#	printf("CREATE REQUEST!!!  %s", ${req.filename.s}->begin());
	#	return true;
	#	%}

};

refine typeattr SMB_Message_Request += &let {
	process_smb_message : bool = $context.flow.proc_smb_message(header, is_orig, unknown_msg);
};
refine typeattr SMB_Message_Response += &let {
	process_smb_message : bool = $context.flow.proc_smb_message(header, is_orig, unknown_msg);
};


refine typeattr SMB_empty_response += &let {
	process_empty_request : bool = $context.flow.proc_smb_empty_response(header);
};

refine typeattr SMB_create_directory_request += &let {
	process_create_directory_request : bool = $context.flow.proc_smb_create_directory_request(header, this);
};
refine typeattr SMB_create_directory_response += &let {
	process_create_directory_response : bool = $context.flow.proc_smb_create_directory_response(header, this);
};
#refine typeattr SMB_delete_directory_request += &let {
#	process_delete_directory_request : bool = $context.flow.proc_smb_delete_directory_request(header, this);
#};
#refine typeattr SMB_delete_directory_response += &let {
#	process_delete_directory_response : bool = $context.flow.proc_smb_delete_directory_response(header, this);
#};
#refine typeattr SMB_open_request += &let {
#	process_open_request : bool = $context.flow.proc_smb_open_request(header, this);
#};
#refine typeattr SMB_open_response += &let {
#	process_open_response : bool = $context.flow.proc_smb_open_response(header, this);
#};
#refine typeattr SMB_create_request += &let {
#	process_create_request : bool = $context.flow.proc_smb_create_request(header, this);
#};
#refine typeattr SMB_create_response += &let {
#	process_create_response : bool = $context.flow.proc_smb_create_response(header, this);
#};
refine typeattr SMB_close_request += &let {
	process_close_request : bool = $context.flow.proc_smb_close_request(header, this);
};
#refine typeattr SMB_flush_request += &let {
#	process_flush_request : bool = $context.flow.proc_smb_flush_request(header, this);
#};
#refine typeattr SMB_flush_response += &let {
#	process_flush_response : bool = $context.flow.proc_smb_flush_response(header, this);
#};
#refine typeattr SMB_delete_request += &let {
#	process_delete_request : bool = $context.flow.proc_smb_delete_request(header, this);
#};
#refine typeattr SMB_delete_response += &let {
#	process_delete_response : bool = $context.flow.proc_smb_delete_response(header, this);
#};
#refine typeattr SMB_rename_request += &let {
#	process_rename_request : bool = $context.flow.proc_smb_rename_request(header, this);
#};
#refine typeattr SMB_rename_response += &let {
#	process_rename_response : bool = $context.flow.proc_smb_rename_response(header, this);
#};
#refine typeattr SMB_query_information_request += &let {
#	process_query_information_request : bool = $context.flow.proc_smb_query_information_request(header, this);
#};
#refine typeattr SMB_query_information_response += &let {
#	process_query_information_response : bool = $context.flow.proc_smb_query_information_response(header, this);
#};
#refine typeattr SMB_set_information_request += &let {
#	process_set_information_request : bool = $context.flow.proc_smb_set_information_request(header, this);
#};
#refine typeattr SMB_set_information_response += &let {
#	process_set_information_response : bool = $context.flow.proc_smb_set_information_response(header, this);
#};
#refine typeattr SMB_read_request += &let {
#	process_read_request : bool = $context.flow.proc_smb_read_request(header, this);
#};
#refine typeattr SMB_read_response += &let {
#	process_read_response : bool = $context.flow.proc_smb_read_response(header, this);
#};
#refine typeattr SMB_write_request += &let {
#	process_write_request : bool = $context.flow.proc_smb_write_request(header, this);
#};
#refine typeattr SMB_write_response += &let {
#	process_write_response : bool = $context.flow.proc_smb_write_response(header, this);
#};
#refine typeattr SMB_lock_byte_range_request += &let {
#	process_lock_byte_range_request : bool = $context.flow.proc_smb_lock_byte_range_request(header, this);
#};
#refine typeattr SMB_lock_byte_range_response += &let {
#	process_lock_byte_range_response : bool = $context.flow.proc_smb_lock_byte_range_response(header, this);
#};
#refine typeattr SMB_unlock_byte_range_request += &let {
#	process_unlock_byte_range_request : bool = $context.flow.proc_smb_unlock_byte_range_request(header, this);
#};
#refine typeattr SMB_unlock_byte_range_response += &let {
#	process_unlock_byte_range_response : bool = $context.flow.proc_smb_unlock_byte_range_response(header, this);
#};
#refine typeattr SMB_create_temporary_request += &let {
#	process_create_temporary_request : bool = $context.flow.proc_smb_create_temporary_request(header, this);
#};
#refine typeattr SMB_create_temporary_response += &let {
#	process_create_temporary_response : bool = $context.flow.proc_smb_create_temporary_response(header, this);
#};
#refine typeattr SMB_create_new_request += &let {
#	process_create_new_request : bool = $context.flow.proc_smb_create_new_request(header, this);
#};
#refine typeattr SMB_create_new_response += &let {
#	process_create_new_response : bool = $context.flow.proc_smb_create_new_response(header, this);
#};
#refine typeattr SMB_check_directory_request += &let {
#	process_check_directory_request : bool = $context.flow.proc_smb_check_directory_request(header, this);
#};
#refine typeattr SMB_check_directory_response += &let {
#	process_check_directory_response : bool = $context.flow.proc_smb_check_directory_response(header, this);
#};
#refine typeattr SMB_process_exit_request += &let {
#	process_process_exit_request : bool = $context.flow.proc_smb_process_exit_request(header, this);
#};
#refine typeattr SMB_process_exit_response += &let {
#	process_process_exit_response : bool = $context.flow.proc_smb_process_exit_response(header, this);
#};
#refine typeattr SMB_seek_request += &let {
#	process_seek_request : bool = $context.flow.proc_smb_seek_request(header, this);
#};
#refine typeattr SMB_seek_response += &let {
#	process_seek_response : bool = $context.flow.proc_smb_seek_response(header, this);
#};
#refine typeattr SMB_lock_and_read_request += &let {
#	process_lock_and_read_request : bool = $context.flow.proc_smb_lock_and_read_request(header, this);
#};
#refine typeattr SMB_lock_and_read_response += &let {
#	process_lock_and_read_response : bool = $context.flow.proc_smb_lock_and_read_response(header, this);
#};
#refine typeattr SMB_write_and_unlock_request += &let {
#	process_write_and_unlock_request : bool = $context.flow.proc_smb_write_and_unlock_request(header, this);
#};
#refine typeattr SMB_write_and_unlock_response += &let {
#	process_write_and_unlock_response : bool = $context.flow.proc_smb_write_and_unlock_response(header, this);
#};
#refine typeattr SMB_read_raw_request += &let {
#	process_read_raw_request : bool = $context.flow.proc_smb_read_raw_request(header, this);
#};
#refine typeattr SMB_read_raw_response += &let {
#	process_read_raw_response : bool = $context.flow.proc_smb_read_raw_response(header, this);
#};
#refine typeattr SMB_read_mpx_request += &let {
#	process_read_mpx_request : bool = $context.flow.proc_smb_read_mpx_request(header, this);
#};
#refine typeattr SMB_read_mpx_response += &let {
#	process_read_mpx_response : bool = $context.flow.proc_smb_read_mpx_response(header, this);
#};
#refine typeattr SMB_read_mpx_secondary_request += &let {
#	process_read_mpx_secondary_request : bool = $context.flow.proc_smb_read_mpx_secondary_request(header, this);
#};
#refine typeattr SMB_read_mpx_secondary_response += &let {
#	process_read_mpx_secondary_response : bool = $context.flow.proc_smb_read_mpx_secondary_response(header, this);
#};
#refine typeattr SMB_write_raw_request += &let {
#	process_write_raw_request : bool = $context.flow.proc_smb_write_raw_request(header, this);
#};
#refine typeattr SMB_write_raw_response += &let {
#	process_write_raw_response : bool = $context.flow.proc_smb_write_raw_response(header, this);
#};
#refine typeattr SMB_write_mpx_request += &let {
#	process_write_mpx_request : bool = $context.flow.proc_smb_write_mpx_request(header, this);
#};
#refine typeattr SMB_write_mpx_response += &let {
#	process_write_mpx_response : bool = $context.flow.proc_smb_write_mpx_response(header, this);
#};
#refine typeattr SMB_write_mpx_secondary_request += &let {
#	process_write_mpx_secondary_request : bool = $context.flow.proc_smb_write_mpx_secondary_request(header, this);
#};
#refine typeattr SMB_write_mpx_secondary_response += &let {
#	process_write_mpx_secondary_response : bool = $context.flow.proc_smb_write_mpx_secondary_response(header, this);
#};
#refine typeattr SMB_write_complete_request += &let {
#	process_write_complete_request : bool = $context.flow.proc_smb_write_complete_request(header, this);
#};
#refine typeattr SMB_write_complete_response += &let {
#	process_write_complete_response : bool = $context.flow.proc_smb_write_complete_response(header, this);
#};
#refine typeattr SMB_query_server_request += &let {
#	process_query_server_request : bool = $context.flow.proc_smb_query_server_request(header, this);
#};
#refine typeattr SMB_query_server_response += &let {
#	process_query_server_response : bool = $context.flow.proc_smb_query_server_response(header, this);
#};
#refine typeattr SMB_set_information2_request += &let {
#	process_set_information2_request : bool = $context.flow.proc_smb_set_information2_request(header, this);
#};
#refine typeattr SMB_set_information2_response += &let {
#	process_set_information2_response : bool = $context.flow.proc_smb_set_information2_response(header, this);
#};
#refine typeattr SMB_query_information2_request += &let {
#	process_query_information2_request : bool = $context.flow.proc_smb_query_information2_request(header, this);
#};
#refine typeattr SMB_query_information2_response += &let {
#	process_query_information2_response : bool = $context.flow.proc_smb_query_information2_response(header, this);
#};
#refine typeattr SMB_locking_andx_request += &let {
#	process_locking_andx_request : bool = $context.flow.proc_smb_locking_andx_request(header, this);
#};
#refine typeattr SMB_locking_andx_response += &let {
#	process_locking_andx_response : bool = $context.flow.proc_smb_locking_andx_response(header, this);
#};
refine typeattr SMB_transaction_request += &let {
	process_transaction_request : bool = $context.flow.proc_smb_transaction_request(header, this);
};
refine typeattr SMB_transaction_response += &let {
	process_transaction_response : bool = $context.flow.proc_smb_transaction_response(header, this);
};
refine typeattr SMB_transaction_secondary_request += &let {
	process_transaction_secondary_request : bool = $context.flow.proc_smb_transaction_secondary_request(header, this);
};
#refine typeattr SMB_ioctl_request += &let {
#	process_ioctl_request : bool = $context.flow.proc_smb_ioctl_request(header, this);
#};
#refine typeattr SMB_ioctl_response += &let {
#	process_ioctl_response : bool = $context.flow.proc_smb_ioctl_response(header, this);
#};
#refine typeattr SMB_ioctl_secondary_request += &let {
#	process_ioctl_secondary_request : bool = $context.flow.proc_smb_ioctl_secondary_request(header, this);
#};
#refine typeattr SMB_ioctl_secondary_response += &let {
#	process_ioctl_secondary_response : bool = $context.flow.proc_smb_ioctl_secondary_response(header, this);
#};
#refine typeattr SMB_copy_request += &let {
#	process_copy_request : bool = $context.flow.proc_smb_copy_request(header, this);
#};
#refine typeattr SMB_copy_response += &let {
#	process_copy_response : bool = $context.flow.proc_smb_copy_response(header, this);
#};
#refine typeattr SMB_move_request += &let {
#	process_move_request : bool = $context.flow.proc_smb_move_request(header, this);
#};
#refine typeattr SMB_move_response += &let {
#	process_move_response : bool = $context.flow.proc_smb_move_response(header, this);
#};
#refine typeattr SMB_echo_request += &let {
#	process_echo_request : bool = $context.flow.proc_smb_echo_request(header, this);
#};
#refine typeattr SMB_echo_response += &let {
#	process_echo_response : bool = $context.flow.proc_smb_echo_response(header, this);
#};
#refine typeattr SMB_write_and_close_request += &let {
#	process_write_and_close_request : bool = $context.flow.proc_smb_write_and_close_request(header, this);
#};
#refine typeattr SMB_write_and_close_response += &let {
#	process_write_and_close_response : bool = $context.flow.proc_smb_write_and_close_response(header, this);
#};
#refine typeattr SMB_open_andx_request += &let {
#	process_open_andx_request : bool = $context.flow.proc_smb_open_andx_request(header, this);
#};
#refine typeattr SMB_open_andx_response += &let {
#	process_open_andx_response : bool = $context.flow.proc_smb_open_andx_response(header, this);
#};
refine typeattr SMB_read_andx_request += &let {
	process_read_andx_request : bool = $context.flow.proc_smb_read_andx_request(header, this);
};
refine typeattr SMB_read_andx_response += &let {
	process_read_andx_response : bool = $context.flow.proc_smb_read_andx_response(header, this);
};
refine typeattr SMB_write_andx_request += &let {
	process_write_andx_request : bool = $context.flow.proc_smb_write_andx_request(header, this);
};
refine typeattr SMB_write_andx_response += &let {
	process_write_andx_response : bool = $context.flow.proc_smb_write_andx_response(header, this);
};
#refine typeattr SMB_new_file_size_request += &let {
#	process_new_file_size_request : bool = $context.flow.proc_smb_new_file_size_request(header, this);
#};
#refine typeattr SMB_new_file_size_response += &let {
#	process_new_file_size_response : bool = $context.flow.proc_smb_new_file_size_response(header, this);
#};
#refine typeattr SMB_close_and_tree_disc_request += &let {
#	process_close_and_tree_disc_request : bool = $context.flow.proc_smb_close_and_tree_disc_request(header, this);
#};
#refine typeattr SMB_close_and_tree_disc_response += &let {
#	process_close_and_tree_disc_response : bool = $context.flow.proc_smb_close_and_tree_disc_response(header, this);
#};
#refine typeattr SMB_transaction2_request += &let {
#	process_transaction2_request : bool = $context.flow.proc_smb_transaction2_request(header, this);
#};
#refine typeattr SMB_transaction2_response += &let {
#	process_transaction2_response : bool = $context.flow.proc_smb_transaction2_response(header, this);
#};
#refine typeattr SMB_transaction2_secondary_request += &let {
#	process_transaction2_secondary_request : bool = $context.flow.proc_smb_transaction2_secondary_request(header, this);
#};
#refine typeattr SMB_transaction2_secondary_response += &let {
#	process_transaction2_secondary_response : bool = $context.flow.proc_smb_transaction2_secondary_response(header, this);
#};
#refine typeattr SMB_find_close2_request += &let {
#	process_find_close2_request : bool = $context.flow.proc_smb_find_close2_request(header, this);
#};
#refine typeattr SMB_find_close2_response += &let {
#	process_find_close2_response : bool = $context.flow.proc_smb_find_close2_response(header, this);
#};
#refine typeattr SMB_find_notify_close_request += &let {
#	process_find_notify_close_request : bool = $context.flow.proc_smb_find_notify_close_request(header, this);
#};
#refine typeattr SMB_find_notify_close_response += &let {
#	process_find_notify_close_response : bool = $context.flow.proc_smb_find_notify_close_response(header, this);
#};
#refine typeattr SMB_tree_connect_request += &let {
#	process_tree_connect_request : bool = $context.flow.proc_smb_tree_connect_request(header, this);
#};
#refine typeattr SMB_tree_connect_response += &let {
#	process_tree_connect_response : bool = $context.flow.proc_smb_tree_connect_response(header, this);
#};
#refine typeattr SMB_tree_disconnect_request += &let {
#	process_tree_disconnect_request : bool = $context.flow.proc_smb_tree_disconnect_request(header, this);
#};
#refine typeattr SMB_tree_disconnect_response += &let {
#	process_tree_disconnect_response : bool = $context.flow.proc_smb_tree_disconnect_response(header, this);
#};
refine typeattr SMB_negotiate_request += &let {
	process_negotiate_request : bool = $context.flow.proc_smb_negotiate_request(header, this);
};
refine typeattr SMB_negotiate_response += &let {
	process_negotiate_response : bool = $context.flow.proc_smb_negotiate_response(header, this);
};
#refine typeattr SMB_session_setup_andx_request += &let {
#	process_session_setup_andx_request : bool = $context.flow.proc_smb_session_setup_andx_request(header, this);
#};
#refine typeattr SMB_session_setup_andx_response += &let {
#	process_session_setup_andx_response : bool = $context.flow.proc_smb_session_setup_andx_response(header, this);
#};
#refine typeattr SMB_logoff_andx_request += &let {
#	process_logoff_andx_request : bool = $context.flow.proc_smb_logoff_andx_request(header, this);
#};
#refine typeattr SMB_logoff_andx_response += &let {
#	process_logoff_andx_response : bool = $context.flow.proc_smb_logoff_andx_response(header, this);
#};
refine typeattr SMB_tree_connect_andx_request += &let {
	process_tree_connect_andx_request : bool = $context.flow.proc_smb_tree_connect_andx_request(header, this);
};
refine typeattr SMB_tree_connect_andx_response += &let {
	process_tree_connect_andx_response : bool = $context.flow.proc_smb_tree_connect_andx_response(header, this);
};
#refine typeattr SMB_query_information_disk_request += &let {
#	process_query_information_disk_request : bool = $context.flow.proc_smb_query_information_disk_request(header, this);
#};
#refine typeattr SMB_query_information_disk_response += &let {
#	process_query_information_disk_response : bool = $context.flow.proc_smb_query_information_disk_response(header, this);
#};
#refine typeattr SMB_search_request += &let {
#	process_search_request : bool = $context.flow.proc_smb_search_request(header, this);
#};
#refine typeattr SMB_search_response += &let {
#	process_search_response : bool = $context.flow.proc_smb_search_response(header, this);
#};
#refine typeattr SMB_find_request += &let {
#	process_find_request : bool = $context.flow.proc_smb_find_request(header, this);
#};
#refine typeattr SMB_find_response += &let {
#	process_find_response : bool = $context.flow.proc_smb_find_response(header, this);
#};
#refine typeattr SMB_find_unique_request += &let {
#	process_find_unique_request : bool = $context.flow.proc_smb_find_unique_request(header, this);
#};
#refine typeattr SMB_find_unique_response += &let {
#	process_find_unique_response : bool = $context.flow.proc_smb_find_unique_response(header, this);
#};
#refine typeattr SMB_find_close_request += &let {
#	process_find_close_request : bool = $context.flow.proc_smb_find_close_request(header, this);
#};
#refine typeattr SMB_find_close_response += &let {
#	process_find_close_response : bool = $context.flow.proc_smb_find_close_response(header, this);
#};
#refine typeattr SMB_nt_transact_request += &let {
#	process_nt_transact_request : bool = $context.flow.proc_smb_nt_transact_request(header, this);
#};
#refine typeattr SMB_nt_transact_response += &let {
#	process_nt_transact_response : bool = $context.flow.proc_smb_nt_transact_response(header, this);
#};
#refine typeattr SMB_nt_transact_secondary_request += &let {
#	process_nt_transact_secondary_request : bool = $context.flow.proc_smb_nt_transact_secondary_request(header, this);
#};
#refine typeattr SMB_nt_transact_secondary_response += &let {
#	process_nt_transact_secondary_response : bool = $context.flow.proc_smb_nt_transact_secondary_response(header, this);
#};
refine typeattr SMB_nt_create_andx_request += &let {
	process_nt_create_andx_request : bool = $context.flow.proc_smb_nt_create_andx_request(header, this);
};
refine typeattr SMB_nt_create_andx_response += &let {
	process_nt_create_andx_response : bool = $context.flow.proc_smb_nt_create_andx_response(header, this);
};
#refine typeattr SMB_nt_cancel_request += &let {
#	process_nt_cancel_request : bool = $context.flow.proc_smb_nt_cancel_request(header, this);
#};
#refine typeattr SMB_nt_cancel_response += &let {
#	process_nt_cancel_response : bool = $context.flow.proc_smb_nt_cancel_response(header, this);
#};
#refine typeattr SMB_nt_rename_request += &let {
#	process_nt_rename_request : bool = $context.flow.proc_smb_nt_rename_request(header, this);
#};
#refine typeattr SMB_nt_rename_response += &let {
#	process_nt_rename_response : bool = $context.flow.proc_smb_nt_rename_response(header, this);
#};
#refine typeattr SMB_open_print_file_request += &let {
#	process_open_print_file_request : bool = $context.flow.proc_smb_open_print_file_request(header, this);
#};
#refine typeattr SMB_open_print_file_response += &let {
#	process_open_print_file_response : bool = $context.flow.proc_smb_open_print_file_response(header, this);
#};
#refine typeattr SMB_write_print_file_request += &let {
#	process_write_print_file_request : bool = $context.flow.proc_smb_write_print_file_request(header, this);
#};
#refine typeattr SMB_write_print_file_response += &let {
#	process_write_print_file_response : bool = $context.flow.proc_smb_write_print_file_response(header, this);
#};
#refine typeattr SMB_close_print_file_request += &let {
#	process_close_print_file_request : bool = $context.flow.proc_smb_close_print_file_request(header, this);
#};
#refine typeattr SMB_close_print_file_response += &let {
#	process_close_print_file_response : bool = $context.flow.proc_smb_close_print_file_response(header, this);
#};
#refine typeattr SMB_get_print_queue_request += &let {
#	process_get_print_queue_request : bool = $context.flow.proc_smb_get_print_queue_request(header, this);
#};
#refine typeattr SMB_get_print_queue_response += &let {
#	process_get_print_queue_response : bool = $context.flow.proc_smb_get_print_queue_response(header, this);
#};
#refine typeattr SMB_read_bulk_request += &let {
#	process_read_bulk_request : bool = $context.flow.proc_smb_read_bulk_request(header, this);
#};
#refine typeattr SMB_read_bulk_response += &let {
#	process_read_bulk_response : bool = $context.flow.proc_smb_read_bulk_response(header, this);
#};
#refine typeattr SMB_write_bulk_request += &let {
#	process_write_bulk_request : bool = $context.flow.proc_smb_write_bulk_request(header, this);
#};
#refine typeattr SMB_write_bulk_response += &let {
#	process_write_bulk_response : bool = $context.flow.proc_smb_write_bulk_response(header, this);
#};
#refine typeattr SMB_write_bulk_data_request += &let {
#	process_write_bulk_data_request : bool = $context.flow.proc_smb_write_bulk_data_request(header, this);
#};
#refine typeattr SMB_write_bulk_data_response += &let {
#	process_write_bulk_data_response : bool = $context.flow.proc_smb_write_bulk_data_response(header, this);
#};