import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
  type MemberRole,
  type MemberStatus,
} from '@/features/members/types';

const ROLE_COLORS: Record<MemberRole, string> = {
  admin: 'purple',
  editor: 'blue',
  viewer: 'default',
};

const STATUS_COLORS: Record<MemberStatus, string> = {
  active: 'success',
  inactive: 'default',
};

export function MemberRoleTag({ role }: { role: MemberRole }) {
  const { t } = useTranslation();
  return <Tag color={ROLE_COLORS[role]}>{t(MEMBER_ROLE_LABELS[role])}</Tag>;
}

export function MemberStatusTag({ status }: { status: MemberStatus }) {
  const { t } = useTranslation();
  return (
    <Tag color={STATUS_COLORS[status]}>{t(MEMBER_STATUS_LABELS[status])}</Tag>
  );
}
