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

		## ``T`` if the notary was able to validate the server certificate.
		delay: count &optional &default = 0;
	};
}

# All DNS lookup results land in this cache. If the yield value is true, it
# means that the notary was able to validate the certificate. If it is false,
# it just means that the notary saw the certificate.
global cache: table[string] of bool &read_expire = 5 min;

# A workaround to access non-local connection state in the when statement.
global ssl_info: table[string] of Info;

event x509_certificate(c: connection, is_orig: bool, cert: X509, chain_idx: count, chain_len: count, der_cert: string) &priority=3
	{
	if ( ! c$ssl?$cert_hash )
        return;

    local hash = c$ssl$cert_hash;

    if ( enable_notary_lookup )
        {
        if ( hash in cache )
            {
            c$ssl$notary_seen = T;
            }
        else
            {
            ++c$ssl$delay;
            ssl_info[hash] = c$ssl;
            local seen = fmt("%s.%s", hash, notary_lookup_host);
            when ( local seen_addrs = lookup_hostname(seen) )
                {
                if ( 127.0.0.2 in seen_addrs )
                    {
                    ssl_info[hash]$notary_seen = T;
                    if ( hash !in cache )
                        cache[hash] = F;
                    }
                }
            }
        }

    if ( enable_notary_validation )
        {
        if ( hash in cache )
            {
            c$ssl$notary_validated = T;
            }
        else
            {
            ++c$ssl$delay;
            ssl_info[hash] = c$ssl;
            local validated = fmt("%s.%s", hash, notary_validation_host);
            when ( local val_addrs = lookup_hostname(validated) )
                {
                if ( 127.0.0.2 in val_addrs )
                    {
                    ssl_info[hash]$notary_validated = T;
                    if ( hash !in cache || cache[hash] == F )
                        cache[hash] = T;
                    }
                }
            }
        }
    }

event log_ssl(rec: Info)
    {
	if ( ! rec?$cert_hash ||
         ! (enable_notary_lookup || enable_notary_validation) )
        return;

    local hash = rec$cert_hash;
    if ( hash in ssl_info && --ssl_info[hash]$delay == 0 )
        delete ssl_info[hash];
    }
