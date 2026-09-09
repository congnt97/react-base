import { describe, expect, it } from 'vitest';

import { redirectToSearchSchema } from '@/shared/validations/common/redirectTo';

describe('redirectToSearchSchema', () => {
  it('giữ lại đường dẫn nội bộ hợp lệ', () => {
    expect(redirectToSearchSchema({ redirectTo: '/projects?page=2' })).toEqual({
      redirectTo: '/projects?page=2',
    });
  });

  it('bỏ redirectTo khi không truyền', () => {
    expect(redirectToSearchSchema({})).toEqual({ redirectTo: undefined });
  });

  it('bỏ redirectTo khi không phải string', () => {
    expect(redirectToSearchSchema({ redirectTo: 123 })).toEqual({
      redirectTo: undefined,
    });
  });

  it('chặn open redirect ra domain ngoài', () => {
    expect(redirectToSearchSchema({ redirectTo: 'https://evil.com' })).toEqual({
      redirectTo: undefined,
    });
    expect(redirectToSearchSchema({ redirectTo: '//evil.com' })).toEqual({
      redirectTo: undefined,
    });
  });

  it('chặn đường dẫn tương đối không bắt đầu bằng /', () => {
    expect(redirectToSearchSchema({ redirectTo: 'projects' })).toEqual({
      redirectTo: undefined,
    });
  });
});
