import { ApiError } from '@/lib/api-error';

export type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  result?: T;
};

/** List paginated by page number (Table). */
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

/** List paginated by cursor (infinite scroll / "Load more"). */
export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

/**
 * Extracts the payload from the backend's `{ data }` or `{ result }` envelope.
 * `null`/`undefined` in both fields is treated as an invalid response.
 */
export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  const value = response.data ?? response.result;

  if (value === undefined) {
    throw new ApiError(response.message ?? 'Phản hồi không hợp lệ từ máy chủ');
  }

  return value;
};
