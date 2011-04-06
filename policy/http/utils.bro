##! Utilities specific for HTTP processing.

@load http/base

module HTTP;

export {
	global extract_keys: function(data: string, kv_splitter: pattern): string_vec;
	global build_url: function(c: connection): string;
}


function extract_keys(data: string, kv_splitter: pattern): string_vec
	{
	local key_vec: vector of string = vector("");
	
	local parts = split(data, kv_splitter);
	for ( part_index in parts )
		{
		local key_val = split1(parts[part_index], /=/);
		# TODO: Change once problem with empty vectors is fixed. (remove the initial value)
		if ( 1 in key_val )
			key_vec[|key_vec|+1] = key_val[1];
		}
	return key_vec;
	}

function build_url(c: connection): string
	{
	return fmt("http://%s/%s", c$http$host, c$http$uri);
	}