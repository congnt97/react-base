import type { PaginationParams } from '@/lib/api-response';

export const MEMBER_ROLES = ['admin', 'editor', 'viewer'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];
export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  admin: 'Quản trị',
  editor: 'Biên tập',
  viewer: 'Chỉ xem',
};

export const MEMBER_STATUSES = ['active', 'inactive'] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];
export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Đã vô hiệu hoá',
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  /** Quan hệ cha con trong cùng entity: người quản lý cũng là thành viên. */
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

/** Hành động hàng loạt: một request cho nhiều id, không lặp từng cái. */
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
