export class ApiError extends Error {
  readonly statusCode?: number;
  /** X-Request-Id gửi kèm request, dùng tra log backend khi báo lỗi. */
  readonly requestId?: string;

  constructor(message: string, statusCode?: number, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

const DEFAULT_ERROR_MESSAGE = 'Đã có lỗi xảy ra';

export const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
};
