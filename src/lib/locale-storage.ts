export enum Locale {
  VI = 'vi',
  EN = 'en',
}

const LOCALE_VALUES: readonly string[] = Object.values(Locale);

export const DEFAULT_LOCALE = Locale.VI;

const LOCALE_KEY = 'react_base_locale';

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && LOCALE_VALUES.includes(value);

export const getStoredLocale = (): Locale => {
  const value = localStorage.getItem(LOCALE_KEY);
  return isLocale(value) ? value : DEFAULT_LOCALE;
};

export const setStoredLocale = (locale: Locale) => {
  localStorage.setItem(LOCALE_KEY, locale);
};
