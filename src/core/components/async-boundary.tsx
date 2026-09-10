import type { ReactNode } from 'react';

type AsyncBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  /** Bốn nhánh đều bắt buộc ở tầng type: không thể quên empty hay error. */
  renderLoading: () => ReactNode;
  renderError: (error: unknown) => ReactNode;
  renderEmpty: () => ReactNode;
  children: ReactNode;
};

/**
 * Headless: chọn đúng nhánh theo trạng thái, không vẽ gì. Adapter cung cấp UI cho
 * từng nhánh. Thứ tự: lỗi > loading > rỗng > data, để lỗi không bị che bởi loading.
 */
export function AsyncBoundary({
  isLoading,
  isError,
  error,
  isEmpty,
  renderLoading,
  renderError,
  renderEmpty,
  children,
}: AsyncBoundaryProps) {
  if (isError) {
    return renderError(error);
  }
  if (isLoading) {
    return renderLoading();
  }
  if (isEmpty) {
    return renderEmpty();
  }
  return children;
}
