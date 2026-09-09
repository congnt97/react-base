export const LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'vi';

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
