#
# @TEST-EXEC: bro %INPUT >out
# @TEST-EXEC: btest-diff out

event bro_init()
	{
	local a = "foo";
	local b = 3;
	local c = T;

	print cat(a, b, c);

	print cat();

	print cat("", 3, T);

	print cat_sep("|", "<empty>", a, b, c);

	print cat_sep("|", "<empty>");
	
	print cat_sep("|", "<empty>", "", b, c);
	}
