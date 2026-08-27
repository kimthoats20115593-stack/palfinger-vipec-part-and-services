import { siteConfig } from "@/lib/site";

/**
 * Some admin-entered image URLs were pasted as absolute links back to this
 * same site (e.g. "https://vipec-palfingerpart.com/parts/foo.jpg") instead
 * of a relative path ("/parts/foo.jpg"). The Next.js Image optimizer
 * rejects a self-referencing absolute URL unless the domain is explicitly
 * allow-listed in next.config, so it silently fails to load. Normalize it
 * back to a relative path here. Genuine external URLs (a different domain)
 * are left untouched.
 */
export function toLocalImageUrl(url: string): string {
  for (const host of [siteConfig.domain, `www.${siteConfig.domain}`]) {
    for (const scheme of ["https://", "http://"]) {
      const prefix = `${scheme}${host}`;
      if (url.startsWith(prefix)) return url.slice(prefix.length) || "/";
    }
  }
  return url;
}
