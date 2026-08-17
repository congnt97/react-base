export type RedirectToSearch = {
  redirectTo?: string;
};

export const redirectToSearchSchema = (search: Record<string, unknown>) => ({
  redirectTo:
    typeof search.redirectTo === 'string' ? search.redirectTo : undefined,
});
