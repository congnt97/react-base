import { Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { Form } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Upload } from '@/components/ui/upload';
import {
  ProjectStatus,
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectPayload,
} from '@/features/projects/types';
import { uploadFile } from '@/lib/upload';

type ProjectFormModalProps = {
  open: boolean;
  project: Project | null;
  submitting: boolean;
  onCancel: () => void;
  /** Trả Promise: Form bọc khoá field, gắn lỗi field từ backend nếu có. */
  onSubmit: (values: ProjectPayload) => Promise<unknown>;
};

const DEFAULT_VALUES: ProjectPayload = {
  name: '',
  owner: '',
  status: ProjectStatus.ACTIVE,
};

const ATTACHMENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

export function ProjectFormModal({
  open,
  project,
  submitting,
  onCancel,
  onSubmit,
}: ProjectFormModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<ProjectPayload>();
  const isEdit = Boolean(project);

  return (
    <Modal
      open={open}
      title={isEdit ? t('Sửa dự án') : t('Tạo dự án')}
      okText={isEdit ? t('Lưu') : t('Tạo dự án')}
      cancelText={t('Huỷ')}
      // Modal bọc: đang gửi thì khoá mask/ESC/X, huỷ form khi đóng để initialValues đúng.
      submitting={submitting}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form<ProjectPayload>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={project ?? DEFAULT_VALUES}
        onSubmit={onSubmit}
      >
        <Form.Item
          label={t('Tên dự án')}
          name="name"
          rules={[{ required: true, message: t('Nhập tên dự án') }]}
        >
          <Input placeholder={t('Ví dụ: CMS nội bộ')} />
        </Form.Item>

        <Form.Item
          label={t('Người phụ trách')}
          name="owner"
          rules={[{ required: true, message: t('Nhập người phụ trách') }]}
        >
          <Input placeholder={t('Tên người phụ trách')} />
        </Form.Item>

        <Form.Item label={t('Trạng thái')} name="status">
          <Select
            options={Object.values(ProjectStatus).map((value) => ({
              value,
              label: t(PROJECT_STATUS_LABELS[value]),
            }))}
          />
        </Form.Item>

        <Form.Item label={t('Mô tả')} name="description">
          <Input.TextArea rows={3} placeholder={t('Không bắt buộc')} />
        </Form.Item>

        <Form.Item label={t('Tài liệu đính kèm')} name="attachmentUrl">
          <Upload accept={ATTACHMENT_TYPES} maxSizeMb={5} upload={uploadFile} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
