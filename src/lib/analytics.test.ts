import { afterEach, describe, expect, it, vi } from 'vitest';

import { analytics } from '@/lib/analytics';

describe('analytics', () => {
  afterEach(() => {
    analytics.reset();
  });

  it('mặc định không làm gì để base không phụ thuộc SDK nào', () => {
    expect(() => {
      analytics.page('/projects');
      analytics.track('project_created', { id: '1' });
    }).not.toThrow();
  });

  it('chuyển page và track tới provider đã đăng ký', () => {
    const provider = { page: vi.fn(), track: vi.fn() };
    analytics.use(provider);

    analytics.page('/projects');
    analytics.track('project_created', { id: '1' });

    expect(provider.page).toHaveBeenCalledWith('/projects');
    expect(provider.track).toHaveBeenCalledWith('project_created', { id: '1' });
  });

  it('reset đưa về provider rỗng', () => {
    const provider = { page: vi.fn(), track: vi.fn() };
    analytics.use(provider);
    analytics.reset();

    analytics.page('/settings');

    expect(provider.page).not.toHaveBeenCalled();
  });
});
