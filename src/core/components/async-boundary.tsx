import type { ReactNode } from 'react';

type AsyncBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  /** All four branches are required at the type level: empty or error can never be forgotten. */
  renderLoading: () => ReactNode;
  renderError: (error: unknown) => ReactNode;
  renderEmpty: () => ReactNode;
  children: ReactNode;
};

/**
 * Headless: picks the right branch based on state, renders nothing itself. The adapter
 * supplies the UI for each branch. Order: error > loading > empty > data, so an error
 * is never hidden behind loading.
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
