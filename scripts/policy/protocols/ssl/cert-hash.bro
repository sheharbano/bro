##! Calculates SHA1 digests for DER formatted server certificates.

@load base/protocols/ssl

module SSL;

export {
	redef record Info += {
		## SHA1 digest of the raw server certificate.
		cert_hash: string &log &optional;
	};
}

event x509_certificate(c: connection, is_orig: bool, cert: X509, chain_idx: count, chain_len: count, der_cert: string) &priority=4
	{
	# We aren't tracking client certificates yet and we are also only tracking
	# the primary cert.  Watch that this came from an SSL analyzed session too.
	if ( is_orig || chain_idx != 0 || ! c?$ssl ) 
		return;

	c$ssl$cert_hash = sha1_hash(der_cert);
	}
