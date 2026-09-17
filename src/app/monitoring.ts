import { analytics } from '@/lib/analytics';
import { initMonitoring, monitoring } from '@/lib/monitoring';

/**
 * Single plug-in point for error reporting and analytics. The base pulls in no SDK
 * to keep the bundle light; a real project swaps in the reporter here, e.g. Sentry:
 *
 *   import * as Sentry from '@sentry/react';
 *   Sentry.init({ dsn: env.VITE_SENTRY_DSN, environment: import.meta.env.MODE });
 *   monitoring.use({
 *     captureException: (error, context) => Sentry.captureException(error, { extra: context }),
 *     setUser: (user) => Sentry.setUser(user),
 *   });
 *
 * Analytics works the same way via analytics.use({ page, track }).
 */
export const setupMonitoring = () => {
  if (import.meta.env.PROD) {
    // TODO(project): monitoring.use(...) and analytics.use(...) with a real SDK.
  }

  void analytics;
  void monitoring;
  initMonitoring();
};
