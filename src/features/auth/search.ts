export type RedirectToSearch = {
  redirectTo?: string;
};

const isInternalPath = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

// Chỉ nhận đường dẫn nội bộ để chặn open redirect.
export const redirectToSearchSchema = (
  search: Record<string, unknown>,
): RedirectToSearch => ({
  redirectTo: isInternalPath(search.redirectTo) ? search.redirectTo : undefined,
});
