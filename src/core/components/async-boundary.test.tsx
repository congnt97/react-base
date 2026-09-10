import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AsyncBoundary } from '@/core/components/async-boundary';

const renderWith = (state: {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}) =>
  render(
    <AsyncBoundary
      isLoading={state.isLoading ?? false}
      isError={state.isError ?? false}
      error={new Error('lỗi mạng')}
      isEmpty={state.isEmpty ?? false}
      renderLoading={() => <p>đang tải</p>}
      renderError={(error) => <p>lỗi: {(error as Error).message}</p>}
      renderEmpty={() => <p>trống</p>}
    >
      <p>dữ liệu</p>
    </AsyncBoundary>,
  );

describe('AsyncBoundary', () => {
  it('ưu tiên lỗi hơn loading để lỗi không bị che', () => {
    renderWith({ isLoading: true, isError: true });
    expect(screen.getByText('lỗi: lỗi mạng')).toBeInTheDocument();
  });

  it('loading khi đang tải', () => {
    renderWith({ isLoading: true });
    expect(screen.getByText('đang tải')).toBeInTheDocument();
  });

  it('rỗng khi không có dữ liệu', () => {
    renderWith({ isEmpty: true });
    expect(screen.getByText('trống')).toBeInTheDocument();
  });

  it('data khi mọi thứ ổn', () => {
    renderWith({});
    expect(screen.getByText('dữ liệu')).toBeInTheDocument();
  });
});
