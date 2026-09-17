import { unwrapResponse, type ApiResponse } from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

export type UploadedFile = {
  url: string;
  name: string;
  size: number;
};

// Upload is shared across every feature, so it lives in lib instead of features/<x>/api.ts.
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
