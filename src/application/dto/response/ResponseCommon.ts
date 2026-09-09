import { ApiError } from '@/application/exceptions/ApiError';

export type ResponseCommon<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
};

export const unwrapResponse = <T>(response: ResponseCommon<T>): T => {
  const value = response.data ?? response.result;

  if (value === undefined) {
    throw new ApiError(response.message ?? 'Phản hồi không hợp lệ từ máy chủ');
  }

  return value;
};
