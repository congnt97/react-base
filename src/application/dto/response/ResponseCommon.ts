import type { FormattedError } from '@/application/dto/response/ErrorResponse';

export type ResponseCommon<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
};

export const unwrapResponse = <T>(response: ResponseCommon<T>): T => {
  const value = response.data ?? response.result;

  if (value === undefined) {
    throw {
      message: response.message ?? 'Phản hồi không hợp lệ từ máy chủ',
    } satisfies FormattedError;
  }

  return value;
};
