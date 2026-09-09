import { describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/api-error';
import { unwrapResponse } from '@/lib/api-response';

describe('unwrapResponse', () => {
  it('trả về data khi có', () => {
    expect(unwrapResponse({ data: { id: 1 } })).toEqual({ id: 1 });
  });

  it('fallback sang result khi không có data', () => {
    expect(unwrapResponse({ result: [1, 2] })).toEqual([1, 2]);
  });

  it('giữ nguyên giá trị falsy hợp lệ như 0, "", false', () => {
    expect(unwrapResponse({ data: 0 })).toBe(0);
    expect(unwrapResponse({ data: '' })).toBe('');
    expect(unwrapResponse({ data: false })).toBe(false);
  });

  it('coi data null như thiếu data (fallback sang result, không có thì throw)', () => {
    expect(unwrapResponse({ data: null, result: 'fallback' })).toBe('fallback');
    expect(() => unwrapResponse({ data: null })).toThrowError(ApiError);
  });

  it('throw ApiError kèm message server khi thiếu data lẫn result', () => {
    expect(() => unwrapResponse({ message: 'Không có quyền' })).toThrowError(
      new ApiError('Không có quyền'),
    );
  });

  it('throw ApiError với message mặc định khi server không trả message', () => {
    expect(() => unwrapResponse({})).toThrowError(
      'Phản hồi không hợp lệ từ máy chủ',
    );
  });
});
