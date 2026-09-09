import { describe, expect, it } from 'vitest';

import { Endpoints } from '@/lib/endpoints';
import { handlers } from '@/mocks/handlers';
import { apiUrl } from '@/mocks/utils';

const endpointPaths = Object.values(Endpoints).flatMap((group) =>
  Object.values(group),
);

// Thêm endpoint mà quên MSW handler là lỗi hay gặp: dev local sẽ gọi thẳng
// backend không tồn tại và mọi thứ "vẫn chạy" cho tới khi mở đúng màn hình.
describe('MSW handlers', () => {
  it('mọi endpoint trong lib/endpoints.ts đều có handler', () => {
    const handled = new Set(
      handlers.map((handler) => String(handler.info.path)),
    );
    const missing = endpointPaths.filter((path) => !handled.has(apiUrl(path)));

    expect(missing, `Thiếu handler cho: ${missing.join(', ')}`).toEqual([]);
  });
});
