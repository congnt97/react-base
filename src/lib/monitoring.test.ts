import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api-error';
import { monitoring, shouldReport, type ErrorReporter } from '@/lib/monitoring';

const createReporter = (): ErrorReporter => ({
  captureException: vi.fn(),
  setUser: vi.fn(),
});

describe('shouldReport', () => {
  it('bỏ qua lỗi nghiệp vụ 4xx', () => {
    expect(shouldReport(new ApiError('Không tìm thấy', 404))).toBe(false);
    expect(shouldReport(new ApiError('Sai mật khẩu', 401))).toBe(false);
  });

  it('báo lỗi 5xx, lỗi mạng và lỗi không phải ApiError', () => {
    expect(shouldReport(new ApiError('Server lỗi', 500))).toBe(true);
    expect(shouldReport(new ApiError('timeout'))).toBe(true);
    expect(shouldReport(new TypeError('x is undefined'))).toBe(true);
  });
});

describe('monitoring', () => {
  afterEach(() => {
    monitoring.reset();
  });

  it('chuyển lỗi và user tới reporter đã đăng ký', () => {
    const reporter = createReporter();
    monitoring.use(reporter);

    const error = new Error('boom');
    monitoring.captureException(error, { route: '/projects' });
    monitoring.setUser({ id: '1', email: 'a@b.c' });

    expect(reporter.captureException).toHaveBeenCalledWith(error, {
      route: '/projects',
    });
    expect(reporter.setUser).toHaveBeenCalledWith({ id: '1', email: 'a@b.c' });
  });

  it('đính kèm requestId của ApiError vào context', () => {
    const reporter = createReporter();
    monitoring.use(reporter);

    const error = new ApiError('Server lỗi', 500, 'req-123');
    monitoring.captureException(error, { queryKey: ['projects'] });

    expect(reporter.captureException).toHaveBeenCalledWith(error, {
      queryKey: ['projects'],
      requestId: 'req-123',
    });
  });

  it('không gọi reporter với lỗi 4xx', () => {
    const reporter = createReporter();
    monitoring.use(reporter);

    monitoring.captureException(new ApiError('Không có quyền', 403));

    expect(reporter.captureException).not.toHaveBeenCalled();
  });
});
