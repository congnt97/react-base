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
 * Key là câu tiếng Việt tự nhiên: `t('Đăng nhập')`. Tiếng Việt không cần file
 * dịch (thiếu key thì i18next trả lại key); ngôn ngữ khác thêm vào src/locales.
 * Code vì thế vẫn đọc được như text thường, không có key kỹ thuật.
 *
 * Bản dịch tải động theo ngôn ngữ đang chọn để chunk đầu không gánh file dịch
 * của ngôn ngữ người dùng không bật.
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

/** Gọi trước khi render để người dùng chọn tiếng Anh không thấy nháy tiếng Việt. */
export const initLocale = () => changeLocale(getStoredLocale());
