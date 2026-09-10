import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MemberFormDrawer } from '@/features/members/components/member-form-drawer';
import { ApiError } from '@/lib/api-error';

const renderDrawer = (onSubmit = vi.fn(() => Promise.resolve())) => {
  render(
    <MemberFormDrawer
      open
      member={null}
      submitting={false}
      onCancel={vi.fn()}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit };
};

describe('MemberFormDrawer', () => {
  it('thiếu trường bắt buộc thì báo lỗi và không submit', async () => {
    const { onSubmit } = renderDrawer();

    await userEvent.click(
      screen.getByRole('button', { name: 'Thêm thành viên' }),
    );

    expect(await screen.findByText('Nhập họ tên')).toBeInTheDocument();
    expect(screen.getByText('Nhập email')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('lỗi field từ backend (422) hiện ngay dưới field email', async () => {
    const onSubmit = vi.fn(() =>
      Promise.reject(
        new ApiError('Dữ liệu không hợp lệ', {
          statusCode: 422,
          fieldErrors: { email: 'Email đã tồn tại' },
        }),
      ),
    );
    renderDrawer(onSubmit);

    await userEvent.type(screen.getByLabelText('Họ tên'), 'Lan');
    await userEvent.type(screen.getByLabelText('Email'), 'lan@example.com');
    await userEvent.click(
      screen.getByRole('button', { name: 'Thêm thành viên' }),
    );

    expect(await screen.findByText('Email đã tồn tại')).toBeInTheDocument();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Lan',
          email: 'lan@example.com',
          role: 'viewer',
        }),
      ),
    );
  });
});
