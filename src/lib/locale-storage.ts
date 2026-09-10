export const LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
// Kiểu literal để chỗ khác loại trừ được ngôn ngữ mặc định (Exclude<Locale, 'vi'>).
export const DEFAULT_LOCALE = 'vi' satisfies Locale;

const LOCALE_KEY = 'react_base_locale';

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

export const getStoredLocale = (): Locale => {
  const value = localStorage.getItem(LOCALE_KEY);
  return isLocale(value) ? value : DEFAULT_LOCALE;
};

export const setStoredLocale = (locale: Locale) => {
  localStorage.setItem(LOCALE_KEY, locale);
};
