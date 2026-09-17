import { EditOutlined } from '@ant-design/icons';
import { getRouteApi, Link } from '@tanstack/react-router';
import { Card, Descriptions } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/feedback/error-state';
import { PageLoading } from '@/components/feedback/page-loading';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Can } from '@/features/auth/components/can';
import { MemberFormDrawer } from '@/features/members/components/member-form-drawer';
import { MemberSessionsTable } from '@/features/members/components/member-sessions-table';
import {
  MemberRoleTag,
  MemberStatusTag,
} from '@/features/members/components/member-tags';
import { useMember } from '@/features/members/hooks/use-member';
import { useUpdateMember } from '@/features/members/hooks/use-member-mutations';
import { useMemberSessions } from '@/features/members/hooks/use-members';
import type { Member, MemberPayload } from '@/features/members/types';
import { formatDateTime } from '@/lib/format';
import { Permission } from '@/features/auth/permissions';

const route = getRouteApi('/_app/members/$id');

function MemberSessions({ memberId }: { memberId: string }) {
  const { t } = useTranslation();
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const updateSearch = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const sessions = useMemberSessions(memberId, search, {
    onPageOverflow: (page) => void updateSearch({ page }),
  });

  return (
    <Card className="app-card" title={t('Phiên đăng nhập gần đây')}>
      {sessions.isError ? (
        <ErrorState error={sessions.error} onRetry={sessions.refetch} />
      ) : (
        <MemberSessionsTable
          list={sessions}
          page={search.page}
          pageSize={search.pageSize}
          onPageChange={(page, pageSize) =>
            void updateSearch({ page, pageSize })
          }
        />
      )}
    </Card>
  );
}

function MemberInfo({ member }: { member: Member }) {
  const { t } = useTranslation();

  return (
    <Card className="app-card">
      <Descriptions
        column={{ xs: 1, md: 2 }}
        items={[
          { key: 'email', label: t('Email'), children: member.email },
          {
            key: 'role',
            label: t('Vai trò'),
            children: <MemberRoleTag role={member.role} />,
          },
          {
            key: 'status',
            label: t('Trạng thái'),
            children: <MemberStatusTag status={member.status} />,
          },
          {
            key: 'manager',
            label: t('Người quản lý'),
            children: member.managerId ? (
              <Link to="/members/$id" params={{ id: member.managerId }}>
                {member.managerName}
              </Link>
            ) : (
              t('Không có')
            ),
          },
          {
            key: 'createdAt',
            label: t('Ngày tạo'),
            children: formatDateTime(member.createdAt),
          },
          {
            key: 'updatedAt',
            label: t('Cập nhật'),
            children: formatDateTime(member.updatedAt),
          },
        ]}
      />
    </Card>
  );
}

export function MemberDetailPage() {
  const { t } = useTranslation();
  const { id } = route.useParams();
  // The loader already called ensureQueryData, so data is available on the very first render.
  const member = useMember(id);
  const updateMember = useUpdateMember();
  const [editing, setEditing] = useState(false);

  if (member.isLoading || !member.data) {
    return member.isError ? (
      <ErrorState error={member.error} onRetry={member.refetch} />
    ) : (
      <PageLoading />
    );
  }

  const data = member.data;
  // The error is already toasted in the mutation; the Form wrapper attaches field errors and keeps the drawer open.
  const handleSubmit = (values: MemberPayload) =>
    updateMember
      .mutateAsync({ id: data.id, ...values })
      .then(() => setEditing(false));

  return (
    <>
      <PageHeader
        title={data.name}
        description={data.email}
        breadcrumbs={[
          { label: t('Thành viên'), to: '/members' },
          { label: data.name },
        ]}
        actions={
          <Can permission={Permission.MEMBERS_UPDATE}>
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              {t('Sửa thành viên')}
            </Button>
          </Can>
        }
      />

      <div className="flex flex-col gap-6">
        <MemberInfo member={data} />
        <MemberSessions memberId={data.id} />
      </div>

      <MemberFormDrawer
        open={editing}
        member={data}
        submitting={updateMember.isPending}
        onCancel={() => setEditing(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
