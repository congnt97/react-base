import { ApiError } from '@/lib/api-error';

export type MonitoringUser = { id: string; email?: string } | null;

export type ErrorReporter = {
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
  setUser: (user: MonitoringUser) => void;
};

// Mặc định log ra console. Production thay bằng Sentry/Datadog qua monitoring.use()
// trong app/monitoring.ts, không sửa file này.
const consoleReporter: ErrorReporter = {
  captureException: (error, context) => {
    console.error('[monitoring]', error, context ?? '');
  },
  setUser: () => undefined,
};

let reporter: ErrorReporter = consoleReporter;

/** Lỗi nghiệp vụ (4xx) là hành vi bình thường, không báo về monitoring. */
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
    // requestId đi kèm để tra đúng dòng log backend.
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

// Bắt lỗi ngoài React tree (script lỗi, promise không catch). Gọi một lần lúc boot.
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
