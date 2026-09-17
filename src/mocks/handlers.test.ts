import { describe, expect, it } from 'vitest';

import { Endpoints } from '@/lib/endpoints';
import { handlers } from '@/mocks/handlers';
import { apiUrl } from '@/mocks/utils';

const endpointPaths = Object.values(Endpoints).flatMap((group) =>
  Object.values(group),
);

// Adding an endpoint and forgetting the MSW handler is a common mistake: local dev calls
// a backend that doesn't exist and everything "still works" until that exact screen is opened.
describe('MSW handlers', () => {
  it('mọi endpoint trong lib/endpoints.ts đều có handler', () => {
    const handled = new Set(
      handlers.map((handler) => String(handler.info.path)),
    );
    const missing = endpointPaths.filter((path) => !handled.has(apiUrl(path)));

    expect(missing, `Thiếu handler cho: ${missing.join(', ')}`).toEqual([]);
  });
});
