export enum LoginReason {
  EXPIRED = 'expired',
}

const LOGIN_REASON_VALUES: readonly string[] = Object.values(LoginReason);

export type LoginSearch = {
  redirectTo?: string;
  /** Vì sao bị đưa về login, để hiện thông báo phù hợp. */
  reason?: LoginReason;
};

const isInternalPath = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const isLoginReason = (value: unknown): value is LoginReason =>
  typeof value === 'string' && LOGIN_REASON_VALUES.includes(value);

// Chỉ nhận đường dẫn nội bộ để chặn open redirect.
export const loginSearchSchema = (
  search: Record<string, unknown>,
): LoginSearch => ({
  redirectTo: isInternalPath(search.redirectTo) ? search.redirectTo : undefined,
  reason: isLoginReason(search.reason) ? search.reason : undefined,
});
