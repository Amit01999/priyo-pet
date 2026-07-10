/**
 * Customer access token lives ONLY in this module-scoped variable — same "never localStorage"
 * rule as authToken.ts, and deliberately a SEPARATE holder so a customer session can never be
 * confused with (or overwrite) an admin session in the same browser.
 */
let customerAccessToken: string | null = null;

export function getCustomerAccessToken(): string | null {
  return customerAccessToken;
}

export function setCustomerAccessToken(token: string | null): void {
  customerAccessToken = token;
}
