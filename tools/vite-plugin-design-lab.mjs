// Chỉ chạy ở dev: mở API để Design Lab đọc và ghi design token vào source.
// Không có plugin này thì design-lab.html chỉ là trang xem, không lưu được.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { readTokens, writeTokenCss } from '../scripts/generate-token-css.mjs';

const ENDPOINT = '/__design-tokens';
const TOKENS_FILE = 'src/app/design-tokens.json';

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};

/**
 * Chỉ nhận đúng hình dạng file hiện có: cùng bộ nhóm, cùng bộ khoá, giá trị cùng
 * kiểu. Trình duyệt không được phép thêm khoá lạ hay ghi file khác.
 */
const assertSameShape = (next, current, trail = '') => {
  const nextKeys = Object.keys(next).sort().join(',');
  const currentKeys = Object.keys(current).sort().join(',');
  if (nextKeys !== currentKeys) {
    throw new Error(`Khoá ở "${trail || 'gốc'}" không khớp file hiện tại`);
  }

  for (const [key, value] of Object.entries(current)) {
    const candidate = next[key];
    const where = trail ? `${trail}.${key}` : key;
    if (typeof value === 'object') {
      assertSameShape(candidate, value, where);
      continue;
    }
    if (typeof candidate !== typeof value) {
      throw new Error(`"${where}" phải là ${typeof value}`);
    }
    if (typeof candidate === 'number' && !(candidate > 0)) {
      throw new Error(`"${where}" phải là số dương`);
    }
    if (typeof candidate === 'string' && candidate.trim() === '') {
      throw new Error(`"${where}" không được rỗng`);
    }
  }
};

export const designLab = () => ({
  name: 'design-lab',
  apply: 'serve',
  configureServer(server) {
    // Bật dev là CSS token luôn khớp JSON, không phải nhớ chạy tay.
    writeTokenCss();

    server.middlewares.use(ENDPOINT, (request, response) => {
      const send = (status, body) => {
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(body));
      };

      if (request.method === 'GET') {
        send(200, readTokens());
        return;
      }

      if (request.method !== 'POST') {
        send(405, { message: 'Chỉ hỗ trợ GET và POST' });
        return;
      }

      void readBody(request)
        .then((raw) => {
          const next = JSON.parse(raw);
          assertSameShape(next, readTokens());

          const file = path.resolve(TOKENS_FILE);
          writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
          writeTokenCss();
          send(200, { message: `Đã lưu ${TOKENS_FILE}` });
        })
        .catch((error) => {
          send(400, {
            message: error instanceof Error ? error.message : 'Lỗi không rõ',
          });
        });
    });
  },
});

export const readCurrentTokens = () =>
  JSON.parse(readFileSync(TOKENS_FILE, 'utf8'));
