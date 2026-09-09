import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import {
  DEFAULT_LOCALE,
  getStoredLocale,
  setStoredLocale,
  type Locale,
} from '@/lib/locale-storage';

/**
 * Key là câu tiếng Việt tự nhiên: `t('Đăng nhập')`. Tiếng Việt không cần file
 * dịch (thiếu key thì i18next trả lại key); ngôn ngữ khác thêm vào src/locales.
 * Code vì thế vẫn đọc được như text thường, không có key kỹ thuật.
 */
void i18n.use(initReactI18next).init({
  lng: getStoredLocale(),
  fallbackLng: DEFAULT_LOCALE,
  resources: { en: { translation: en } },
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

dayjs.locale(i18n.language);

export const changeLocale = async (locale: Locale) => {
  setStoredLocale(locale);
  dayjs.locale(locale);
  await i18n.changeLanguage(locale);
};

export { i18n };
