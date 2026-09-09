const LOGIN_REASONS = ['expired'] as const;

export type LoginReason = (typeof LOGIN_REASONS)[number];

export type LoginSearch = {
  redirectTo?: string;
  /** Vì sao bị đưa về login, để hiện thông báo phù hợp. */
  reason?: LoginReason;
};

const isInternalPath = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const isLoginReason = (value: unknown): value is LoginReason =>
  typeof value === 'string' &&
  (LOGIN_REASONS as readonly string[]).includes(value);

// Chỉ nhận đường dẫn nội bộ để chặn open redirect.
export const loginSearchSchema = (
  search: Record<string, unknown>,
): LoginSearch => ({
  redirectTo: isInternalPath(search.redirectTo) ? search.redirectTo : undefined,
  reason: isLoginReason(search.reason) ? search.reason : undefined,
});
