import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/api-error';
import { uploadFile } from '@/lib/upload';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('uploadFile', () => {
  it('gửi file dưới dạng multipart field "file" và unwrap response', async () => {
    let contentType: string | null = null;
    let hasFileField = false;

    server.use(
      mswHttp.post('/api/files', async ({ request }) => {
        contentType = request.headers.get('Content-Type');
        hasFileField = (await request.formData()).has('file');
        return HttpResponse.json({
          success: true,
          data: { url: '/uploads/a.pdf', name: 'a.pdf', size: 3 },
        });
      }),
    );

    const result = await uploadFile(
      new File(['pdf'], 'a.pdf', { type: 'application/pdf' }),
    );

    expect(hasFileField).toBe(true);
    expect(contentType).toContain('multipart/form-data');
    // Tên file không assert được: axios trong jsdom dùng XHR nên filename thành
    // "blob"; trình duyệt thật giữ nguyên. E2E patterns.spec.ts kiểm tên file.
    expect(result).toEqual({ url: '/uploads/a.pdf', name: 'a.pdf', size: 3 });
  });

  it('throw ApiError khi server từ chối', async () => {
    server.use(
      mswHttp.post('/api/files', () =>
        HttpResponse.json(
          { message: 'File quá lớn', statusCode: 413 },
          { status: 413 },
        ),
      ),
    );

    const error = await uploadFile(
      new File(['x'], 'b.pdf', { type: 'application/pdf' }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe('File quá lớn');
    expect((error as ApiError).statusCode).toBe(413);
  });
});
