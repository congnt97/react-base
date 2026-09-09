import { describe, expect, it } from 'vitest';

import { getFormattedErrorMessage } from '@/application/dto/response/ErrorResponse';
import { ApiError } from '@/application/exceptions/ApiError';

describe('getFormattedErrorMessage', () => {
  it('lấy message từ ApiError', () => {
    expect(getFormattedErrorMessage(new ApiError('Sai mật khẩu', 401))).toBe(
      'Sai mật khẩu',
    );
  });

  it('lấy message từ Error thường', () => {
    expect(getFormattedErrorMessage(new Error('Mất kết nối'))).toBe(
      'Mất kết nối',
    );
  });

  it('trả message mặc định với lỗi không có message hoặc message rỗng', () => {
    expect(getFormattedErrorMessage(undefined)).toBe('Đã có lỗi xảy ra');
    expect(getFormattedErrorMessage('chuỗi lỗi')).toBe('Đã có lỗi xảy ra');
    expect(getFormattedErrorMessage({ message: '   ' })).toBe(
      'Đã có lỗi xảy ra',
    );
    expect(getFormattedErrorMessage({ message: 42 })).toBe('Đã có lỗi xảy ra');
  });
});
