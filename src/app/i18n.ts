import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LOCALE,
  getStoredLocale,
  setStoredLocale,
  Locale,
} from '@/lib/locale-storage';

/**
 * Keys are natural Vietnamese sentences: `t('Đăng nhập')`. Vietnamese needs no
 * translation file (a missing key falls back to the key itself in i18next);
 * other languages get a file added under src/locales. This way the code
 * still reads like plain text, with no technical keys.
 *
 * Translation bundles load dynamically based on the selected language, so
 * the initial chunk doesn't carry the translation file for a language the
 * user hasn't enabled.
 */
const BUNDLES: Record<
  Exclude<Locale, typeof DEFAULT_LOCALE>,
  () => Promise<{ default: Record<string, string> }>
> = {
  [Locale.EN]: () => import('@/locales/en.json'),
};

const loadBundle = async (locale: Locale) => {
  if (
    locale === DEFAULT_LOCALE ||
    i18n.hasResourceBundle(locale, 'translation')
  ) {
    return;
  }
  const bundle = await BUNDLES[locale]();
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
  dayjs.locale(locale);
  await i18n.changeLanguage(locale);
};

/** Call before rendering so users who picked English don't see a flash of Vietnamese. */
export const initLocale = () => changeLocale(getStoredLocale());
