import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('bấm 3 lần khi hành động async đang chạy thì handler chỉ chạy 1 lần', async () => {
    let finish!: () => void;
    const onClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(<Button onClick={onClick}>Lưu</Button>);
    const button = screen.getByRole('button', { name: 'Lưu' });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveClass('ant-btn-loading');

    finish();
    await waitFor(() => expect(button).not.toHaveClass('ant-btn-loading'));
  });

  it('onClick đồng bộ vẫn hoạt động bình thường', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Mở</Button>);
    const button = screen.getByRole('button', { name: 'Mở' });

    await userEvent.click(button);
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('loading truyền từ ngoài được ưu tiên', () => {
    render(<Button loading>Gửi</Button>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-loading');
  });
});
