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
  /** Required: an empty result must tell the user what to do. */
  emptyState: ReactNode;
  loadingState?: ReactNode;
  children: ReactNode;
};

/** AsyncBoundary with default UI: skeleton, ErrorState with retry, empty state required. */
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
