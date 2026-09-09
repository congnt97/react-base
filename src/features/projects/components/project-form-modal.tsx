import { Form, Input, Modal, Select } from 'antd';

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

const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({
  value,
  label: PROJECT_STATUS_LABELS[value],
}));

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
  const [form] = Form.useForm<ProjectPayload>();
  const isEdit = Boolean(project);

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa dự án' : 'Tạo dự án'}
      okText={isEdit ? 'Lưu' : 'Tạo dự án'}
      cancelText="Huỷ"
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
          label="Tên dự án"
          name="name"
          rules={[{ required: true, message: 'Nhập tên dự án' }]}
        >
          <Input placeholder="Ví dụ: CMS nội bộ" />
        </Form.Item>

        <Form.Item
          label="Người phụ trách"
          name="owner"
          rules={[{ required: true, message: 'Nhập người phụ trách' }]}
        >
          <Input placeholder="Tên người phụ trách" />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select options={STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Không bắt buộc" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
