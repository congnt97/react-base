import { beforeEach, describe, expect, it } from 'vitest';

import { getStoredLocale, setStoredLocale } from '@/lib/locale-storage';

describe('locale-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mặc định vi khi chưa lưu', () => {
    expect(getStoredLocale()).toBe('vi');
  });

  it('lưu và đọc lại locale hợp lệ', () => {
    setStoredLocale('en');
    expect(getStoredLocale()).toBe('en');
  });

  it('về mặc định khi storage chứa giá trị lạ', () => {
    localStorage.setItem('react_base_locale', 'fr');
    expect(getStoredLocale()).toBe('vi');
  });
});
