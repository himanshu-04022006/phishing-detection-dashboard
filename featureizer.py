import re
import numpy as np
import tldextract

def extract_url_feats(urls_str):

    urls = [u.strip() for u in str(urls_str).split() if u.strip()]

    n = len(urls)
    ip_like = 0
    suspicious_tld = 0
    lookalike = 0

    sus_tlds = {"zip", "mov", "click", "country", "gq", "work"}

    for u in urls:

        if re.search(r"https?://\d{1,3}(\.\d{1,3}){3}", u):
            ip_like += 1

        ext = tldextract.extract(u)

        domain = f"{ext.domain}.{ext.suffix}".lower()

        if ext.suffix in sus_tlds:
            suspicious_tld += 1

        if re.search(r"paypa[l1]|micr0soft|amaz0n|1ogin|0tp", domain):
            lookalike += 1

    return [n, ip_like, suspicious_tld, lookalike]