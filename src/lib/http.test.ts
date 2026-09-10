import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ApiError } from '@/lib/api-error';
import {
  persistAuthTokens,
  getStoredAccessToken,
  subscribeSessionExpired,
} from '@/lib/auth-storage';
import { http } from '@/lib/http';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => localStorage.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('http', () => {
  it('gắn X-Request-Id khác nhau cho mỗi request và đưa vào ApiError khi lỗi', async () => {
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
    const error = await http.get('/boom').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).requestId).toBe(seen[1]);
    expect(seen[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(seen[0]).not.toBe(seen[1]);
  });

  it('gộp message dạng mảng của backend thành một chuỗi', async () => {
    server.use(
      mswHttp.get('/api/invalid', () =>
        HttpResponse.json(
          { message: ['Thiếu tên', 'Thiếu email'], statusCode: 400 },
          { status: 400 },
        ),
      ),
    );

    await expect(http.get('/invalid')).rejects.toThrowError(
      'Thiếu tên, Thiếu email',
    );
  });

  it('đưa lỗi theo field của backend vào ApiError.fieldErrors', async () => {
    server.use(
      mswHttp.post('/api/members', () =>
        HttpResponse.json(
          {
            message: 'Dữ liệu không hợp lệ',
            statusCode: 422,
            errors: {
              email: 'Email đã tồn tại',
              name: ['Thiếu tên', 'Quá ngắn'],
            },
          },
          { status: 422 },
        ),
      ),
    );

    const error = await http.post('/members', {}).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).fieldErrors).toEqual({
      email: 'Email đã tồn tại',
      name: 'Thiếu tên, Quá ngắn',
    });
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

  it('gặp 401 thì refresh token rồi chạy lại request với token mới', async () => {
    persistAuthTokens({ accessToken: 'token-cu', refreshToken: 'refresh-ok' });
    const authHeaders: (string | null)[] = [];

    server.use(
      mswHttp.get('/api/me', ({ request }) => {
        const auth = request.headers.get('Authorization');
        authHeaders.push(auth);
        return auth === 'Bearer token-moi'
          ? HttpResponse.json({ success: true, data: 'ok' })
          : HttpResponse.json({ statusCode: 401 }, { status: 401 });
      }),
      mswHttp.post('/api/auth/refresh-token', () =>
        HttpResponse.json({
          success: true,
          data: { accessToken: 'token-moi', refreshToken: 'refresh-ok' },
        }),
      ),
    );

    await expect(http.get('/me')).resolves.toEqual({
      success: true,
      data: 'ok',
    });
    expect(authHeaders).toEqual(['Bearer token-cu', 'Bearer token-moi']);
    expect(getStoredAccessToken()).toBe('token-moi');
  });

  it('nhiều request 401 cùng lúc chỉ gọi refresh một lần', async () => {
    persistAuthTokens({ accessToken: 'token-cu', refreshToken: 'refresh-ok' });
    let refreshCalls = 0;

    server.use(
      mswHttp.get('/api/a', ({ request }) =>
        request.headers.get('Authorization') === 'Bearer token-moi'
          ? HttpResponse.json({ success: true, data: 'a' })
          : HttpResponse.json({ statusCode: 401 }, { status: 401 }),
      ),
      mswHttp.get('/api/b', ({ request }) =>
        request.headers.get('Authorization') === 'Bearer token-moi'
          ? HttpResponse.json({ success: true, data: 'b' })
          : HttpResponse.json({ statusCode: 401 }, { status: 401 }),
      ),
      mswHttp.post('/api/auth/refresh-token', async () => {
        refreshCalls += 1;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return HttpResponse.json({
          success: true,
          data: { accessToken: 'token-moi', refreshToken: 'refresh-ok' },
        });
      }),
    );

    await Promise.all([http.get('/a'), http.get('/b')]);

    expect(refreshCalls).toBe(1);
  });

  it('refresh thất bại thì xoá token và báo phiên hết hạn', async () => {
    persistAuthTokens({
      accessToken: 'token-cu',
      refreshToken: 'refresh-hỏng',
    });
    const onExpired = vi.fn();
    const unsubscribe = subscribeSessionExpired(onExpired);

    server.use(
      mswHttp.get('/api/me', () =>
        HttpResponse.json({ statusCode: 401 }, { status: 401 }),
      ),
      mswHttp.post('/api/auth/refresh-token', () =>
        HttpResponse.json({ statusCode: 401 }, { status: 401 }),
      ),
    );

    await expect(http.get('/me')).rejects.toThrowError(ApiError);

    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(getStoredAccessToken()).toBeNull();
    unsubscribe();
  });

  it('gửi được body và url param cho post/put/patch/delete', async () => {
    const calls: { method: string; url: string; body: unknown }[] = [];
    const record = async ({
      request,
    }: {
      request: Request;
    }): Promise<Response> => {
      calls.push({
        method: request.method,
        url: new URL(request.url).pathname,
        body: await request.json().catch(() => null),
      });
      return HttpResponse.json({ success: true, data: null });
    };

    server.use(
      mswHttp.post('/api/items', record),
      mswHttp.put('/api/items/:id', record),
      mswHttp.patch('/api/items/:id', record),
      mswHttp.delete('/api/items/:id', record),
    );

    await http.post('/items', { name: 'a' });
    await http.put('/items/:id', { name: 'b' }, { urlParams: { id: '7' } });
    await http.patch('/items/:id', { name: 'c' }, { urlParams: { id: '7' } });
    await http.delete('/items/:id', undefined, { urlParams: { id: '7' } });

    expect(calls.map((call) => `${call.method} ${call.url}`)).toEqual([
      'POST /api/items',
      'PUT /api/items/7',
      'PATCH /api/items/7',
      'DELETE /api/items/7',
    ]);
    expect(calls[0]?.body).toEqual({ name: 'a' });
  });
});
