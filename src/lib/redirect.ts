// Only follow same-site paths from a ?next= param — "//evil.com" or
// "/\evil.com" would otherwise send users off-site after signing in.
export function safeRedirect(next: string | null, fallback = "/") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
