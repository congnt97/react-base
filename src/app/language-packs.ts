import type { Locale as AntdLocale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import viVN from 'antd/locale/vi_VN';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/vi';

import type { Locale } from '@/lib/locale-storage';

/**
 * AntD's own strings (pagination, empty state, popconfirm...) and dayjs's date/number
 * formatting for each fully-supported language. A locale listed here gets both; a locale
 * that only has a `src/locales/<code>.json` file (see lib/locale-storage.ts) still gets
 * the app's own text localized on its own — AntD's internal microcopy and date formatting
 * just stay Vietnamese until a pack is added here.
 *
 * AntD ships each locale under its own `<lang>_<REGION>` filename (`ja_JP`, not `ja`), so
 * this can't be auto-discovered from the locale code the way translation files are.
 * Adding a language here is 3 lines: a `dayjs/locale/<code>` side-effect import above, an
 * `antd/locale/<CODE>` import above, and one entry below.
 */
export const ANTD_LOCALES: Partial<Record<Locale, AntdLocale>> = {
  vi: viVN,
  en: enUS,
  ja: jaJP,
};

export const DEFAULT_ANTD_LOCALE = viVN;
