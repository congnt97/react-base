export type FormattedError = {
  message: string;
  statusCode?: number;
};

export const getFormattedErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Đã có lỗi xảy ra';
};
