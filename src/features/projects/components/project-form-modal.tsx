import { Form, Input, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectPayload,
} from '@/features/projects/types';

type ProjectFormModalProps = {
  open: boolean;
  project: Project | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ProjectPayload) => void;
};

const DEFAULT_VALUES: ProjectPayload = {
  name: '',
  owner: '',
  status: 'active',
};

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
      confirmLoading={submitting}
      onOk={() => form.submit()}
      onCancel={onCancel}
      // Huỷ form mỗi lần đóng để initialValues luôn đúng với project đang sửa.
      destroyOnHidden
    >
      <Form<ProjectPayload>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={project ?? DEFAULT_VALUES}
        onFinish={onSubmit}
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
            options={PROJECT_STATUSES.map((value) => ({
              value,
              label: t(PROJECT_STATUS_LABELS[value]),
            }))}
          />
        </Form.Item>

        <Form.Item label={t('Mô tả')} name="description">
          <Input.TextArea rows={3} placeholder={t('Không bắt buộc')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
