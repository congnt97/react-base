import { PlusOutlined } from '@ant-design/icons';
import { getRouteApi } from '@tanstack/react-router';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/use-confirm';
import { Can } from '@/features/auth/components/can';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { MemberFormDrawer } from '@/features/members/components/member-form-drawer';
import { MembersBulkBar } from '@/features/members/components/members-bulk-bar';
import { MembersFilter } from '@/features/members/components/members-filter';
import { MembersTable } from '@/features/members/components/members-table';
import { useMemberForm } from '@/features/members/hooks/use-member-form';
import { useDeleteMember } from '@/features/members/hooks/use-member-mutations';
import { useMembers } from '@/features/members/hooks/use-members';
import { useMembersSelection } from '@/features/members/hooks/use-members-selection';
import type { MembersSearch } from '@/features/members/search';
import type { Member } from '@/features/members/types';

const route = getRouteApi('/_app/members/');

export function MembersPage() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { can } = usePermissions();
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const selection = useMembersSelection();

  // URL là source of truth cho filter/pagination; đổi trang/filter thì bỏ chọn.
  const updateSearch = (patch: Partial<MembersSearch>) => {
    selection.clear();
    return navigate({ search: (prev) => ({ ...prev, ...patch }) });
  };

  const members = useMembers(search, {
    onPageOverflow: (page) => void updateSearch({ page }),
  });
  const form = useMemberForm();
  const deleteMember = useDeleteMember();

  const canUpdate = can('members:update');
  const canDelete = can('members:delete');
  const hasFilter = Boolean(search.keyword ?? search.role ?? search.status);

  const confirmDelete = (member: Member) =>
    confirm({
      title: t('Xoá thành viên "{{name}}"?', { name: member.name }),
      content: t('Hành động này không thể hoàn tác.'),
      okText: t('Xoá'),
      cancelText: t('Huỷ'),
      danger: true,
      onConfirm: () => deleteMember.mutateAsync(member.id),
    });

  return (
    <>
      <PageHeader
        title={t('Thành viên')}
        description={t(
          'Ví dụ chọn nhiều dòng và hành động hàng loạt, drawer form với select tìm từ server, bảng con phân trang trên trang chi tiết.',
        )}
        actions={
          <Can permission="members:create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={form.openCreate}
            >
              {t('Thêm thành viên')}
            </Button>
          </Can>
        }
      />

      <Card className="app-card">
        <div className="flex flex-col gap-4">
          <MembersFilter
            keyword={search.keyword}
            role={search.role}
            status={search.status}
            onChange={(filter) => void updateSearch({ ...filter, page: 1 })}
          />

          {canUpdate ? (
            <MembersBulkBar
              count={selection.selectedIds.length}
              onActivate={selection.activate}
              onDeactivate={selection.deactivate}
              onClear={selection.clear}
            />
          ) : null}

          {members.isError ? (
            <ErrorState error={members.error} onRetry={members.refetch} />
          ) : (
            <MembersTable
              list={members}
              page={search.page}
              pageSize={search.pageSize}
              onPageChange={(page, pageSize) =>
                void updateSearch({ page, pageSize })
              }
              emptyState={
                hasFilter ? (
                  <EmptyState
                    title={t('Không có thành viên nào khớp bộ lọc')}
                    description={t('Thử đổi từ khoá hoặc bỏ bớt bộ lọc.')}
                  />
                ) : (
                  <EmptyState
                    title={t('Chưa có thành viên')}
                    description={t('Thêm người đầu tiên vào nhóm.')}
                    action={
                      can('members:create')
                        ? {
                            label: t('Thêm thành viên'),
                            icon: <PlusOutlined />,
                            onClick: form.openCreate,
                          }
                        : undefined
                    }
                  />
                )
              }
              selection={
                canUpdate
                  ? {
                      ids: selection.selectedIds,
                      onChange: selection.setSelectedIds,
                    }
                  : undefined
              }
              onEdit={canUpdate ? form.openEdit : undefined}
              onDelete={
                canDelete ? (member) => void confirmDelete(member) : undefined
              }
            />
          )}
        </div>
      </Card>

      <MemberFormDrawer
        open={form.open}
        member={form.member}
        submitting={form.submitting}
        onCancel={form.close}
        onSubmit={form.submit}
      />
    </>
  );
}
