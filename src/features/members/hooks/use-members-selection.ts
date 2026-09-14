import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfirm } from '@/components/ui/use-confirm';
import { useUpdateMembersStatus } from '@/features/members/hooks/use-member-mutations';
import { MemberStatus } from '@/features/members/types';

/**
 * Chọn nhiều dòng và hành động hàng loạt. Đổi trang/filter thì bỏ chọn, vì id đã
 * chọn không còn trên màn hình và người dùng không thấy mình đang tác động vào gì.
 */
export function useMembersSelection() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const updateStatus = useUpdateMembersStatus();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const clear = () => setSelectedIds([]);

  const setStatus = async (status: MemberStatus) => {
    const confirmed = await confirm({
      title:
        status === MemberStatus.ACTIVE
          ? t('Kích hoạt {{count}} thành viên?', { count: selectedIds.length })
          : t('Vô hiệu hoá {{count}} thành viên?', {
              count: selectedIds.length,
            }),
      content: t('Áp dụng cho tất cả thành viên đang chọn.'),
      okText:
        status === MemberStatus.ACTIVE ? t('Kích hoạt') : t('Vô hiệu hoá'),
      cancelText: t('Huỷ'),
      danger: status === MemberStatus.INACTIVE,
      onConfirm: () => updateStatus.mutateAsync({ ids: selectedIds, status }),
    });
    if (confirmed) {
      clear();
    }
  };

  return {
    selectedIds,
    setSelectedIds,
    clear,
    activate: () => setStatus(MemberStatus.ACTIVE),
    deactivate: () => setStatus(MemberStatus.INACTIVE),
  };
}
