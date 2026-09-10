import { Skeleton } from 'antd';
import type { ReactNode } from 'react';

import { ErrorState } from '@/components/feedback/error-state';
import { AsyncBoundary } from '@/core/components/async-boundary';

type QueryBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  onRetry: () => void;
  /** Bắt buộc: dữ liệu rỗng phải có nội dung nói người dùng nên làm gì. */
  emptyState: ReactNode;
  loadingState?: ReactNode;
  children: ReactNode;
};

/** AsyncBoundary với UI mặc định: skeleton, ErrorState có thử lại, empty state bắt buộc. */
export function QueryBoundary({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  emptyState,
  loadingState,
  children,
}: QueryBoundaryProps) {
  return (
    <AsyncBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={isEmpty}
      renderLoading={() =>
        loadingState ?? <Skeleton active paragraph={{ rows: 4 }} />
      }
      renderError={(reason) => <ErrorState error={reason} onRetry={onRetry} />}
      renderEmpty={() => emptyState}
    >
      {children}
    </AsyncBoundary>
  );
}
