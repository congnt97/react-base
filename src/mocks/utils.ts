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
