import { describe, expect, it } from 'vitest';

import { LoginReason, loginSearchSchema } from '@/features/auth/search';

describe('loginSearchSchema', () => {
  it('giữ lại đường dẫn nội bộ hợp lệ', () => {
    expect(loginSearchSchema({ redirectTo: '/projects?page=2' })).toEqual({
      redirectTo: '/projects?page=2',
      reason: undefined,
    });
  });

  it('bỏ redirectTo khi không truyền hoặc không phải string', () => {
    expect(loginSearchSchema({})).toEqual({
      redirectTo: undefined,
      reason: undefined,
    });
    expect(loginSearchSchema({ redirectTo: 123 }).redirectTo).toBeUndefined();
  });

  it('chặn open redirect ra domain ngoài', () => {
    expect(
      loginSearchSchema({ redirectTo: 'https://evil.com' }).redirectTo,
    ).toBeUndefined();
    expect(
      loginSearchSchema({ redirectTo: '//evil.com' }).redirectTo,
    ).toBeUndefined();
  });

  it('chặn đường dẫn tương đối không bắt đầu bằng /', () => {
    expect(
      loginSearchSchema({ redirectTo: 'projects' }).redirectTo,
    ).toBeUndefined();
  });

  it('chỉ nhận reason trong danh sách cho phép', () => {
    expect(loginSearchSchema({ reason: 'expired' }).reason).toBe(
      LoginReason.EXPIRED,
    );
    expect(loginSearchSchema({ reason: 'hacked' }).reason).toBeUndefined();
  });
});
