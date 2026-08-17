export type RedirectToSearch = {
  redirectTo?: string;
};

const isInternalPath = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.startsWith('/') &&
  !value.startsWith('//');

export const redirectToSearchSchema = (search: Record<string, unknown>) => ({
  redirectTo: isInternalPath(search.redirectTo) ? search.redirectTo : undefined,
});
