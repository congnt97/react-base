import { setupServer } from 'msw/node';
import { http as mswHttp, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/api-error';
import { http } from '@/lib/http';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('http', () => {
  it('gắn X-Request-Id vào mỗi request và đưa vào ApiError khi lỗi', async () => {
    const seen: (string | null)[] = [];
    server.use(
      mswHttp.get('/api/ping', ({ request }) => {
        seen.push(request.headers.get('X-Request-Id'));
        return HttpResponse.json({ success: true, data: 'pong' });
      }),
      mswHttp.get('/api/boom', ({ request }) => {
        seen.push(request.headers.get('X-Request-Id'));
        return HttpResponse.json(
          { message: 'Hỏng rồi', statusCode: 500 },
          { status: 500 },
        );
      }),
    );

    await http.get('/ping');
    await expect(http.get('/boom')).rejects.toThrowError(ApiError);

    expect(seen).toHaveLength(2);
    expect(seen[0]).toMatch(/^[0-9a-f-]{36}$/);
    // Mỗi request một id riêng để tra log đúng dòng.
    expect(seen[0]).not.toBe(seen[1]);
  });

  it('truyền signal để huỷ được request', async () => {
    server.use(
      mswHttp.get('/api/slow', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return HttpResponse.json({ success: true, data: 'muộn' });
      }),
    );

    const controller = new AbortController();
    const request = http.get('/slow', { signal: controller.signal });
    controller.abort();

    await expect(request).rejects.toThrow();
  });
});
