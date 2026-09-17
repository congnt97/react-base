import type { PaginationParams } from '@/lib/api-response';

// A closed set of values goes through an enum; see docs/skills/naming.md.
export enum MemberRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  [MemberRole.ADMIN]: 'Quản trị',
  [MemberRole.EDITOR]: 'Biên tập',
  [MemberRole.VIEWER]: 'Chỉ xem',
};

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: 'Đang hoạt động',
  [MemberStatus.INACTIVE]: 'Đã vô hiệu hoá',
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  /** A parent-child relationship within the same entity: a manager is also a member. */
  managerId?: string;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
};

export type MemberPayload = Pick<Member, 'name' | 'email' | 'role'> & {
  managerId?: string;
};

export type MemberListParams = PaginationParams & {
  keyword?: string;
  role?: MemberRole;
  status?: MemberStatus;
};

/** Bulk action: one request for many ids, instead of repeating one at a time. */
export type MemberStatusPayload = {
  ids: string[];
  status: MemberStatus;
};

export type MemberSession = {
  id: string;
  memberId: string;
  device: string;
  ip: string;
  createdAt: string;
};

export type MemberSessionListParams = PaginationParams;
