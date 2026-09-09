import { analytics } from '@/lib/analytics';
import { initMonitoring, monitoring } from '@/lib/monitoring';

/**
 * Điểm cắm duy nhất cho error reporting và analytics. Base không kéo SDK nào
 * để giữ bundle nhẹ; dự án thật thay reporter ở đây, ví dụ Sentry:
 *
 *   import * as Sentry from '@sentry/react';
 *   Sentry.init({ dsn: env.VITE_SENTRY_DSN, environment: import.meta.env.MODE });
 *   monitoring.use({
 *     captureException: (error, context) => Sentry.captureException(error, { extra: context }),
 *     setUser: (user) => Sentry.setUser(user),
 *   });
 *
 * Analytics tương tự qua analytics.use({ page, track }).
 */
export const setupMonitoring = () => {
  if (import.meta.env.PROD) {
    // TODO(dự án): monitoring.use(...) và analytics.use(...) với SDK thật.
  }

  void analytics;
  void monitoring;
  initMonitoring();
};
