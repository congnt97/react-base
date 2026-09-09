import { delay, http } from 'msw';

import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

export const filesHandlers = [
  http.post(apiUrl(Endpoints.Files.UPLOAD), async ({ request }) => {
    await delay(500);
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return fail(400, 'Thiếu file');
    }

    return ok({
      url: `/uploads/${Date.now()}-${encodeURIComponent(file.name)}`,
      name: file.name,
      size: file.size,
    });
  }),
];
