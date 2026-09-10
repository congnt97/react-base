/** Lỗi theo field từ backend (422): `{ email: 'Email đã tồn tại' }`. */
export type FieldErrors = Record<string, string>;

type ApiErrorOptions = {
  statusCode?: number;
  /** X-Request-Id gửi kèm request, dùng tra log backend khi báo lỗi. */
  requestId?: string;
  fieldErrors?: FieldErrors;
};

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly requestId?: string;
  /** Có thì Form adapter gắn thẳng vào field; không có thì toast `message`. */
  readonly fieldErrors?: FieldErrors;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.fieldErrors = options.fieldErrors;
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
