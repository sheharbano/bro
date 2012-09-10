##! Check SSL certificate validity through a notary.

@load base/protocols/ssl

module SSL;

export {
    ## The hostname of the notary containing all server certificate hashes.
    const notary_lookup_host = "all.notary.bro-ids.org" &redef;

    ## The hostname of the notary containing valid server certificate hashes.
    const notary_validation_host = "validated.notary.bro-ids.org" &redef;

    ## If ``T``, Bro performs a certificate hash lookup for each SSL session
    ## containing a server certificate, checking whether the notary has seen
    ## the certificate.
	const enable_notary_lookup = T &redef;

    ## If ``T``, Bro performs a certificate hash lookup for each SSL session
    ## containing a server certificate, checking whether the notary was able to
    ## validate the certificate.
	const enable_notary_validation = T &redef;

	redef record Info += {
		## ``T`` if the notary has seen the server certificate.
		notary_seen: bool &log &optional;

		## ``T`` if the notary was able to validate the server certificate.
		notary_validated: bool &log &optional;
	};
}

event x509_certificate(c: connection, is_orig: bool, cert: X509, chain_idx: count, chain_len: count, der_cert: string) &priority=3
	{
	if ( is_orig || chain_idx != 0 || ! c$ssl?$cert_hash )
        return;

    if ( enable_notary_lookup )
        {
        local seen = fmt("%s.%s", c$ssl$cert_hash, notary_lookup_host);
        when ( local seen_addrs = lookup_hostname(seen) )
            {
            c$ssl$notary_seen = 127.0.0.2 in seen_addrs;
            }
        }

    if ( enable_notary_validation )
        {
        local validated = fmt("%s.%s", c$ssl$cert_hash, notary_validation_host);
        when ( local val_addrs = lookup_hostname(validated) )
            {
            c$ssl$notary_validated = 127.0.0.2 in val_addrs;
            }
        }
    }
