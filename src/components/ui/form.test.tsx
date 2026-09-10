import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Input } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';
import { ApiError } from '@/lib/api-error';

type Values = { email: string };

const renderForm = (onSubmit: (values: Values) => unknown) =>
  render(
    <Form<Values> onSubmit={onSubmit} initialValues={{ email: 'a@b.c' }}>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <button type="submit">Gửi</button>
    </Form>,
  );

describe('Form', () => {
  it('submit liên tục khi đang gửi chỉ gọi onSubmit một lần, field bị khoá', async () => {
    let finish!: () => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    renderForm(onSubmit);
    const submit = screen.getByRole('button', { name: 'Gửi' });

    await userEvent.click(submit);
    await userEvent.click(submit);
    await userEvent.click(submit);

    await waitFor(() => expect(screen.getByLabelText('Email')).toBeDisabled());
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.c' });

    finish();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeEnabled());
  });

  it('ApiError.fieldErrors hiện ngay dưới field tương ứng', async () => {
    const onSubmit = vi.fn(() =>
      Promise.reject(
        new ApiError('Dữ liệu không hợp lệ', {
          statusCode: 422,
          fieldErrors: { email: 'Email đã tồn tại' },
        }),
      ),
    );
    renderForm(onSubmit);

    await userEvent.click(screen.getByRole('button', { name: 'Gửi' }));

    expect(await screen.findByText('Email đã tồn tại')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeEnabled();
  });
});
