import { HttpResponse } from 'msw';

import { env } from '@/lib/env';

export const apiUrl = (path: string) => `${env.VITE_API_BASE_URL}${path}`;

export const ok = <T>(data: T) => HttpResponse.json({ success: true, data });

export const fail = (statusCode: number, message: string) =>
  HttpResponse.json(
    { success: false, statusCode, message },
    { status: statusCode },
  );
