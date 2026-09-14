import { beforeEach, describe, expect, it } from 'vitest';

import { getStoredLocale, Locale, setStoredLocale } from '@/lib/locale-storage';

describe('locale-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mặc định vi khi chưa lưu', () => {
    expect(getStoredLocale()).toBe(Locale.VI);
  });

  it('lưu và đọc lại locale hợp lệ', () => {
    setStoredLocale(Locale.EN);
    expect(getStoredLocale()).toBe(Locale.EN);
  });

  it('về mặc định khi storage chứa giá trị lạ', () => {
    localStorage.setItem('react_base_locale', 'fr');
    expect(getStoredLocale()).toBe(Locale.VI);
  });
});
