import { unwrapResponse, type ApiResponse } from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

export type UploadedFile = {
  url: string;
  name: string;
  size: number;
};

// Upload dùng chung cho mọi feature nên đặt ở lib thay vì features/<x>/api.ts.
export const uploadFile = async (file: File) => {
  const body = new FormData();
  body.append('file', file);

  return unwrapResponse(
    await http.post<ApiResponse<UploadedFile>, FormData>(
      Endpoints.Files.UPLOAD,
      body,
    ),
  );
};
