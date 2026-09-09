import { describe, expect, it } from 'vitest';

import { ApiError, getErrorMessage } from '@/lib/api-error';

describe('getErrorMessage', () => {
  it('lấy message từ ApiError', () => {
    expect(getErrorMessage(new ApiError('Sai mật khẩu', 401))).toBe(
      'Sai mật khẩu',
    );
  });

  it('lấy message từ Error thường', () => {
    expect(getErrorMessage(new Error('Mất kết nối'))).toBe('Mất kết nối');
  });

  it('trả message mặc định với lỗi không có message hoặc message rỗng', () => {
    expect(getErrorMessage(undefined)).toBe('Đã có lỗi xảy ra');
    expect(getErrorMessage('chuỗi lỗi')).toBe('Đã có lỗi xảy ra');
    expect(getErrorMessage({ message: '   ' })).toBe('Đã có lỗi xảy ra');
    expect(getErrorMessage({ message: 42 })).toBe('Đã có lỗi xảy ra');
  });
});
