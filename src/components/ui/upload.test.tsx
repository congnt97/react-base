import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { App } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { Upload } from '@/components/ui/upload';

const setup = () => {
  const upload = vi.fn((file: File) =>
    Promise.resolve({
      url: 'https://cdn.example.com/tai-lieu.pdf',
      name: file.name,
      size: file.size,
    }),
  );
  const onChange = vi.fn();
  render(
    <App>
      <Upload
        accept={['application/pdf']}
        maxSizeMb={1}
        upload={upload}
        onChange={onChange}
      />
    </App>,
  );
  const input = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  return { upload, onChange, input };
};

describe('Upload', () => {
  it('file sai định dạng bị chặn ở client, không gọi upload', async () => {
    const { upload, input } = setup();

    await userEvent.upload(
      input,
      new File(['x'], 'script.exe', { type: 'application/x-msdownload' }),
      { applyAccept: false },
    );

    expect(
      await screen.findByText('Định dạng file không được hỗ trợ'),
    ).toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });

  it('file quá cỡ bị chặn', async () => {
    const { upload, input } = setup();
    const big = new File([new Uint8Array(1024 * 1024 + 1)], 'to.pdf', {
      type: 'application/pdf',
    });

    await userEvent.upload(input, big);

    expect(await screen.findByText('File vượt quá 1 MB')).toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });

  it('file hợp lệ thì upload và trả URL qua onChange', async () => {
    const { upload, onChange, input } = setup();

    await userEvent.upload(
      input,
      new File(['%PDF-1.4'], 'tai-lieu.pdf', { type: 'application/pdf' }),
    );

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        'https://cdn.example.com/tai-lieu.pdf',
      ),
    );
  });
});
