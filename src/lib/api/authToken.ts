/**
 * Access token lives ONLY in this module-scoped variable — never localStorage, never React
 * state. A hard refresh loses it on purpose; AdminAuthContext silently re-mints it on boot via
 * the httpOnly refresh cookie before rendering any protected admin content.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
