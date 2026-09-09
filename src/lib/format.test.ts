import { describe, expect, it } from 'vitest';

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatNumber,
} from '@/lib/format';

describe('format', () => {
  it('ngày và ngày giờ theo DD/MM/YYYY', () => {
    expect(formatDate('2026-01-05T09:00:00.000Z')).toMatch(/^05\/01\/2026$/);
    expect(formatDateTime(new Date(2026, 0, 5, 16, 30))).toBe(
      '05/01/2026 16:30',
    );
  });

  it('số và tiền theo vi-VN', () => {
    expect(formatNumber(1234567)).toBe('1.234.567');
    expect(formatCurrency(1500000)).toMatch(/^1\.500\.000\s?₫$/);
    expect(formatCurrency(12.5, 'USD', 'en-US')).toBe('$12.50');
  });

  it('kích thước file đổi đơn vị đúng ngưỡng 1024', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1.023 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1,5 MB');
  });
});
