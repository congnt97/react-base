import type { PaginationParams } from '@/lib/api-response';

// Tập giá trị đóng đi qua enum; xem docs/skills/naming.md.
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
