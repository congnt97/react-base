import { Input, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { SearchSelect } from '@/components/ui/search-select';
import { membersApi } from '@/features/members/api';
import {
  MemberRole,
  MemberStatus,
  MEMBER_ROLE_LABELS,
  type Member,
  type MemberPayload,
} from '@/features/members/types';

type MemberFormDrawerProps = {
  open: boolean;
  member: Member | null;
  submitting: boolean;
  onCancel: () => void;
  /** Trả Promise: Form bọc khoá field, gắn lỗi field từ backend nếu có. */
  onSubmit: (values: MemberPayload) => Promise<unknown>;
};

const DEFAULT_VALUES: MemberPayload = {
  name: '',
  email: '',
  role: MemberRole.VIEWER,
};

/** Tìm người quản lý trong chính danh sách thành viên, bỏ người đang sửa. */
const searchManagers =
  (excludeId?: string) => async (keyword: string, signal: AbortSignal) => {
    const page = await membersApi.list(
      { keyword, page: 1, pageSize: 10, status: MemberStatus.ACTIVE },
      { signal },
    );
    return page.items
      .filter((member) => member.id !== excludeId)
      .map((member) => ({ value: member.id, label: member.name }));
  };

export function MemberFormDrawer({
  open,
  member,
  submitting,
  onCancel,
  onSubmit,
}: MemberFormDrawerProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<MemberPayload>();
  const isEdit = Boolean(member);

  return (
    <Drawer
      open={open}
      title={isEdit ? t('Sửa thành viên') : t('Thêm thành viên')}
      size={420}
      submitting={submitting}
      onClose={onCancel}
      footer={
        <Space className="flex justify-end">
          <Button onClick={onCancel} disabled={submitting}>
            {t('Huỷ')}
          </Button>
          <Button
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
          >
            {isEdit ? t('Lưu') : t('Thêm thành viên')}
          </Button>
        </Space>
      }
    >
      <Form<MemberPayload>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={member ?? DEFAULT_VALUES}
        submitting={submitting}
        onSubmit={onSubmit}
      >
        <Form.Item
          label={t('Họ tên')}
          name="name"
          rules={[{ required: true, message: t('Nhập họ tên') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('Email')}
          name="email"
          rules={[
            { required: true, message: t('Nhập email') },
            { type: 'email', message: t('Email không hợp lệ') },
          ]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item label={t('Vai trò')} name="role">
          <Select
            options={Object.values(MemberRole).map((value) => ({
              value,
              label: t(MEMBER_ROLE_LABELS[value]),
            }))}
          />
        </Form.Item>

        <Form.Item label={t('Người quản lý')} name="managerId">
          <SearchSelect
            search={searchManagers(member?.id)}
            selectedOption={
              member?.managerId && member.managerName
                ? { value: member.managerId, label: member.managerName }
                : undefined
            }
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
