export class ApiError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
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
