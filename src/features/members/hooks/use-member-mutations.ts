import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { membersApi } from '@/features/members/api';
import { memberKeys } from '@/features/members/hooks/use-members';
import type {
  MemberPayload,
  MemberStatusPayload,
} from '@/features/members/types';
import { getErrorMessage } from '@/lib/api-error';

function useMemberMutationFeedback(successMessage: string) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      message.success(t(successMessage));
      return queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
    onError: (error: unknown) => {
      message.error(t(getErrorMessage(error)));
    },
  };
}

export function useCreateMember() {
  return useMutation({
    mutationFn: membersApi.create,
    ...useMemberMutationFeedback('Đã thêm thành viên'),
  });
}

export function useUpdateMember() {
  return useMutation({
    mutationFn: ({ id, ...body }: MemberPayload & { id: string }) =>
      membersApi.update(id, body),
    ...useMemberMutationFeedback('Đã cập nhật thành viên'),
  });
}

export function useDeleteMember() {
  return useMutation({
    mutationFn: membersApi.remove,
    ...useMemberMutationFeedback('Đã xoá thành viên'),
  });
}

/** Đổi trạng thái nhiều thành viên trong một request. */
export function useUpdateMembersStatus() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MemberStatusPayload) => membersApi.patchMany(body),
    onSuccess: (_, { ids }) => {
      message.success(
        t('Đã cập nhật {{count}} thành viên', { count: ids.length }),
      );
      return queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
    onError: (error: unknown) => {
      message.error(t(getErrorMessage(error)));
    },
  });
}
