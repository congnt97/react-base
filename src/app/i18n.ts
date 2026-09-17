import dayjs from 'dayjs';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ANTD_LOCALES } from '@/app/language-packs';
import {
  DEFAULT_LOCALE,
  getStoredLocale,
  setStoredLocale,
  type Locale,
} from '@/lib/locale-storage';

/**
 * Keys are natural Vietnamese sentences: `t('Đăng nhập')`. Vietnamese needs no
 * translation file (a missing key falls back to the key itself in i18next);
 * other languages get a file added under src/locales — `lib/locale-storage.ts`
 * discovers it automatically, no other file needs editing for the translation
 * itself. This way the code still reads like plain text, with no technical keys.
 *
 * Translation bundles load dynamically based on the selected language, so
 * the initial chunk doesn't carry the translation file for a language the
 * user hasn't enabled.
 */
const TRANSLATION_BUNDLES = import.meta.glob<{
  default: Record<string, string>;
}>('/src/locales/*.json');

const loadBundle = async (locale: Locale) => {
  if (
    locale === DEFAULT_LOCALE ||
    i18n.hasResourceBundle(locale, 'translation')
  ) {
    return;
  }
  const load = TRANSLATION_BUNDLES[`/src/locales/${locale}.json`];
  if (!load) {
    return;
  }
  const bundle = await load();
  i18n.addResourceBundle(locale, 'translation', bundle.default);
};

void i18n.use(initReactI18next).init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  resources: {},
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

dayjs.locale(DEFAULT_LOCALE);

export const changeLocale = async (locale: Locale) => {
  setStoredLocale(locale);
  await loadBundle(locale);
  // Only activate dayjs's locale when it has actually been imported somewhere (see
  // app/language-packs.ts); an unregistered locale name would leave dayjs formatting
  // in an undefined state instead of a safe Vietnamese fallback.
  if (locale in ANTD_LOCALES) {
    dayjs.locale(locale);
  }
  await i18n.changeLanguage(locale);
};

/** Call before rendering so users who picked English don't see a flash of Vietnamese. */
export const initLocale = () => changeLocale(getStoredLocale());
