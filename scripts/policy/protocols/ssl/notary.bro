##! Check SSL certificate validity through a notary.

@load policy/protocols/ssl/cert-hash

module Notary;

export {
    redef enum Log::ID += { LOG };

    ## If ``T``, Bro performs a certificate hash lookup for each SSL session
    ## containing a server certificate, checking whether the notary has seen
    ## the certificate and whether the notary was able to validate it..
	const enable_notary = T &redef;

    ## The hostname of the notary containing all server certificate hashes.
    const all = "all.notary.bro-ids.org" &redef;

    ## The hostname of the notary containing valid server certificate hashes.
    const validated = "validated.notary.bro-ids.org" &redef;

	type Info: record {
	    ## The time when the certficate event fires.
	    ts: time &log;

	    ## The connection UID.
	    uid: string &log;

	    ## The certificate hash.
	    hash: string &log;

		## ``T`` if the notary has seen the server certificate.
		seen: bool &log &default=F;

		## ``T`` if the notary was able to validate the server certificate.
		validated: bool &log &default=F;

		lookups: count &default=2;
	};

	global log_notary: event(rec: Info);
}

# All DNS lookup results land in this cache. If the yield value is true, it
# means that the notary was able to validate the certificate. If it is false,
# it just means that the notary saw the certificate.
global cache: table[string] of bool &create_expire = 1 hr;

# A workaround to access non-local connection state in the when statement.
global ssl_info: table[string] of Info;

event bro_init() &priority=5
    {
    if ( enable_notary )
        Log::create_stream(Notary::LOG, [$columns=Info, $ev=log_notary]);
    }

event x509_certificate(c: connection, is_orig: bool, cert: X509, chain_idx: count, chain_len: count, der_cert: string) &priority=3
	{
    if ( ! enable_notary || is_orig )
        return;

    local hash: string;
	if ( chain_idx == 0 && c$ssl?$cert_hash )
        hash = c$ssl$cert_hash;
    else
        hash = sha1_hash(der_cert);

    local rec: Info = [$ts=network_time(), $uid = c$uid, $hash=hash];

    if ( hash in cache )
        {
        rec$seen = T;
        rec$validated = cache[hash];
        Log::write(LOG, rec);
        }
    else if ( hash !in ssl_info )
        {
        ssl_info[hash] = rec;
        when ( local seen = lookup_hostname(fmt("%s.%s", hash, all)) )
            {
            if ( 127.0.0.2 in seen )
                {
                ssl_info[hash]$seen = T;
                }
            if ( --ssl_info[hash]$lookups == 0 )
                {
                Log::write(LOG, ssl_info[hash]);
                delete ssl_info[hash];
                if ( hash !in cache )
                    cache[hash] = F;
                }
            }
        when ( local valid = lookup_hostname(fmt("%s.%s", hash, validated)) )
            {
            if ( 127.0.0.2 in valid )
                {
                ssl_info[hash]$validated = T;
                }
            if ( --ssl_info[hash]$lookups == 0 )
                {
                Log::write(LOG, ssl_info[hash]);
                delete ssl_info[hash];
                if ( hash !in cache || cache[hash] == F )
                    cache[hash] = T;
                }
            }
        }
    }
