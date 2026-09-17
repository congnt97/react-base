export enum LoginReason {
  EXPIRED = 'expired',
}

const LOGIN_REASON_VALUES: readonly string[] = Object.values(LoginReason);

export type LoginSearch = {
  redirectTo?: string;
  /** Why the user was sent back to login, so the right message can be shown. */
  reason?: LoginReason;
};

const isInternalPath = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const isLoginReason = (value: unknown): value is LoginReason =>
  typeof value === 'string' && LOGIN_REASON_VALUES.includes(value);

// Only accepts internal paths, to block an open redirect.
export const loginSearchSchema = (
  search: Record<string, unknown>,
): LoginSearch => ({
  redirectTo: isInternalPath(search.redirectTo) ? search.redirectTo : undefined,
  reason: isLoginReason(search.reason) ? search.reason : undefined,
});
