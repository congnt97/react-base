import { ApiError } from '@/lib/api-error';

export type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
};

/** List phân trang theo số trang (Table). */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

/** List phân trang theo cursor (infinite scroll / "Tải thêm"). */
export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

/**
 * Lấy payload từ envelope `{ data }` hoặc `{ result }` của backend.
 * `null`/`undefined` ở cả hai field đều bị coi là phản hồi không hợp lệ.
 */
export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  const value = response.data ?? response.result;

  if (value === undefined) {
    throw new ApiError(response.message ?? 'Phản hồi không hợp lệ từ máy chủ');
  }

  return value;
};
