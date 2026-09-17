import { ApiError } from '@/lib/api-error';

export type MonitoringUser = { id: string; email?: string } | null;

export type ErrorReporter = {
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
  setUser: (user: MonitoringUser) => void;
};

// Logs to the console by default. Production swaps in Sentry/Datadog via monitoring.use()
// in app/monitoring.ts — don't edit this file.
const consoleReporter: ErrorReporter = {
  captureException: (error, context) => {
    console.error('[monitoring]', error, context ?? '');
  },
  setUser: () => undefined,
};

let reporter: ErrorReporter = consoleReporter;

/** A business error (4xx) is normal behavior; don't report it to monitoring. */
export const shouldReport = (error: unknown) =>
  !(
    error instanceof ApiError &&
    error.statusCode !== undefined &&
    error.statusCode < 500
  );

export const monitoring = {
  use: (next: ErrorReporter) => {
    reporter = next;
  },
  reset: () => {
    reporter = consoleReporter;
  },
  captureException: (error: unknown, context?: Record<string, unknown>) => {
    if (!shouldReport(error)) {
      return;
    }
    // requestId is attached so it can be matched against the right backend log line.
    const requestId = error instanceof ApiError ? error.requestId : undefined;
    reporter.captureException(
      error,
      requestId ? { ...context, requestId } : context,
    );
  },
  setUser: (user: MonitoringUser) => {
    reporter.setUser(user);
  },
};

// Catches errors outside the React tree (script errors, uncaught promise rejections). Call once at boot.
export const initMonitoring = () => {
  window.addEventListener('error', (event) => {
    monitoring.captureException(event.error ?? event.message, {
      source: 'window.error',
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.captureException(event.reason, {
      source: 'unhandledrejection',
    });
  });
};
