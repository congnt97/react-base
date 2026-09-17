export type Locale = string;

export const DEFAULT_LOCALE: Locale = 'vi';

const LOCALE_KEY = 'react_base_locale';

const TRANSLATION_FILES = import.meta.glob('/src/locales/*.json');

/**
 * 'vi' (default, no file needed) plus every `src/locales/*.json` file present. Adding a
 * language is just dropping the file here — this list picks it up on its own, nothing
 * else to edit for the translation itself. See `app/language-packs.ts` for the separate,
 * optional piece (AntD's own strings, date/number formatting).
 */
export const AVAILABLE_LOCALES: readonly Locale[] = [
  DEFAULT_LOCALE,
  ...Object.keys(TRANSLATION_FILES).map((path) =>
    path.replace('/src/locales/', '').replace(/\.json$/, ''),
  ),
];

/** Vietnamese label key for a locale's own display name, shown via `t()`. Unlisted locale falls back to its code. */
export const LOCALE_LABELS: Partial<Record<Locale, string>> = {
  vi: 'Tiếng Việt',
  en: 'Tiếng Anh',
  ja: 'Tiếng Nhật',
};

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && AVAILABLE_LOCALES.includes(value);

export const getStoredLocale = (): Locale => {
  const value = localStorage.getItem(LOCALE_KEY);
  return isLocale(value) ? value : DEFAULT_LOCALE;
};

export const setStoredLocale = (locale: Locale) => {
  localStorage.setItem(LOCALE_KEY, locale);
};
