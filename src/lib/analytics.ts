export type AnalyticsProvider = {
  page: (path: string) => void;
  track: (event: string, properties?: Record<string, unknown>) => void;
};

// Does nothing by default. Production swaps in GA4/PostHog/Mixpanel via analytics.use()
// in app/monitoring.ts.
const noopProvider: AnalyticsProvider = {
  page: () => undefined,
  track: () => undefined,
};

let provider: AnalyticsProvider = noopProvider;

export const analytics = {
  use: (next: AnalyticsProvider) => {
    provider = next;
  },
  reset: () => {
    provider = noopProvider;
  },
  page: (path: string) => provider.page(path),
  track: (event: string, properties?: Record<string, unknown>) =>
    provider.track(event, properties),
};
