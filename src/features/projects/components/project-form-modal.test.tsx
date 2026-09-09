import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProjectFormModal } from '@/features/projects/components/project-form-modal';
import type { Project } from '@/features/projects/types';

const project: Project = {
  id: 'p1',
  name: 'CMS nội bộ',
  owner: 'Lan',
  status: 'paused',
  description: 'Mô tả',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const renderModal = (
  props: Partial<Parameters<typeof ProjectFormModal>[0]>,
) => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <ProjectFormModal
      open
      project={null}
      submitting={false}
      onCancel={onCancel}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return { onSubmit, onCancel };
};

describe('ProjectFormModal', () => {
  it('báo lỗi validate và không submit khi thiếu trường bắt buộc', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal({});

    await user.click(screen.getByRole('button', { name: 'Tạo dự án' }));

    expect(await screen.findByText('Nhập tên dự án')).toBeInTheDocument();
    expect(screen.getByText('Nhập người phụ trách')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submit đúng giá trị nhập với status mặc định active', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal({});

    await user.type(screen.getByLabelText('Tên dự án'), 'Dự án A');
    await user.type(screen.getByLabelText('Người phụ trách'), 'Minh');
    await user.click(screen.getByRole('button', { name: 'Tạo dự án' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dự án A',
          owner: 'Minh',
          status: 'active',
        }),
      ),
    );
  });

  it('điền sẵn dữ liệu khi sửa và đổi nhãn nút', () => {
    renderModal({ project });

    expect(
      screen.getByRole('dialog', { name: 'Sửa dự án' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Tên dự án')).toHaveValue('CMS nội bộ');
    expect(screen.getByLabelText('Người phụ trách')).toHaveValue('Lan');
    expect(screen.getByRole('button', { name: 'Lưu' })).toBeInTheDocument();
  });

  it('gọi onCancel khi bấm Huỷ', async () => {
    const user = userEvent.setup();
    const { onCancel } = renderModal({});

    await user.click(screen.getByRole('button', { name: 'Huỷ' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
