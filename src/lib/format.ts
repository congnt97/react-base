import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Every display format goes through here so the whole app stays consistent and changes in one place.
// The date locale follows dayjs.locale(), set in app/i18n.ts.

export const formatDate = (value: string | Date) =>
  dayjs(value).format('DD/MM/YYYY');

export const formatDateTime = (value: string | Date) =>
  dayjs(value).format('DD/MM/YYYY HH:mm');

export const formatRelativeTime = (value: string | Date) =>
  dayjs(value).fromNow();

export const formatNumber = (value: number, locale = 'vi-VN') =>
  new Intl.NumberFormat(locale).format(value);

export const formatCurrency = (
  value: number,
  currency = 'VND',
  locale = 'vi-VN',
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value);

/** Bytes -> "1.5 MB". */
export const formatFileSize = (bytes: number, locale = 'vi-VN') => {
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let size = bytes;
  let unit: (typeof units)[number] = 'B';

  for (const next of units.slice(1)) {
    if (size < 1024) {
      break;
    }
    size /= 1024;
    unit = next;
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(size)} ${unit}`;
};
