import { HttpResponse } from 'msw';

import { env } from '@/lib/env';

export const apiUrl = (path: string) => `${env.VITE_API_BASE_URL}${path}`;

/** Lấy phần tử theo vòng, kiểu trả về không undefined nhờ tuple không rỗng. */
export const cycle = <T>(items: readonly [T, ...T[]], index: number): T =>
  items[index % items.length] ?? items[0];

export const ok = <T>(data: T) => HttpResponse.json({ success: true, data });

export const fail = (statusCode: number, message: string) =>
  HttpResponse.json(
    { success: false, statusCode, message },
    { status: statusCode },
  );

/** Lỗi theo field (422): `lib/http.ts` đưa `errors` vào `ApiError.fieldErrors`. */
export const failFields = (
  statusCode: number,
  message: string,
  errors: Record<string, string>,
) =>
  HttpResponse.json(
    { success: false, statusCode, message, errors },
    { status: statusCode },
  );

/** So khớp filter dạng chuỗi trên URL với giá trị enum, không so enum với chuỗi lạ. */
export const matchesFilter = (value: string, filter: string | null) =>
  !filter || value === filter;

/** Cắt trang theo `page`/`pageSize` trên URL, đúng envelope PaginatedResponse. */
export const paginate = <T>(items: T[], url: URL) => {
  const page = Number(url.searchParams.get('page') ?? 1);
  const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
};
