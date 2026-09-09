const DEFAULT_ERROR_MESSAGE = 'Đã có lỗi xảy ra';

export const getFormattedErrorMessage = (error: unknown) => {
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
