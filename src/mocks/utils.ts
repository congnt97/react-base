import { HttpResponse } from 'msw';

import { env } from '@/lib/env';

export const apiUrl = (path: string) => `${env.VITE_API_BASE_URL}${path}`;

/** Picks an element cyclically; the return type isn't undefined thanks to the non-empty tuple. */
export const cycle = <T>(items: readonly [T, ...T[]], index: number): T =>
  items[index % items.length] ?? items[0];

export const ok = <T>(data: T) => HttpResponse.json({ success: true, data });

export const fail = (statusCode: number, message: string) =>
  HttpResponse.json(
    { success: false, statusCode, message },
    { status: statusCode },
  );

/** Field-level error (422): `lib/http.ts` puts `errors` into `ApiError.fieldErrors`. */
export const failFields = (
  statusCode: number,
  message: string,
  errors: Record<string, string>,
) =>
  HttpResponse.json(
    { success: false, statusCode, message, errors },
    { status: statusCode },
  );

/** Matches a string filter from the URL against an enum value, without comparing the enum to an arbitrary string. */
export const matchesFilter = (value: string, filter: string | null) =>
  !filter || value === filter;

/** Slices a page by the URL's `page`/`pageSize`, matching the PaginatedResponse envelope. */
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
