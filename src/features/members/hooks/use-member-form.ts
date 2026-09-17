import { useState } from 'react';

import {
  useCreateMember,
  useUpdateMember,
} from '@/features/members/hooks/use-member-mutations';
import type { Member, MemberPayload } from '@/features/members/types';

type FormState = { open: boolean; member: Member | null };

/** Bundles the create/edit drawer's state and submit flow so the page only wires up UI. */
export function useMemberForm() {
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const [state, setState] = useState<FormState>({ open: false, member: null });

  const close = () => setState({ open: false, member: null });

  // The error is already toasted in the mutation hook; the Form wrapper attaches field errors and keeps the drawer open.
  const submit = (values: MemberPayload) => {
    const mutation = state.member
      ? updateMember.mutateAsync({ id: state.member.id, ...values })
      : createMember.mutateAsync(values);
    return mutation.then(close);
  };

  return {
    open: state.open,
    member: state.member,
    submitting: createMember.isPending || updateMember.isPending,
    openCreate: () => setState({ open: true, member: null }),
    openEdit: (member: Member) => setState({ open: true, member }),
    close,
    submit,
  };
}
