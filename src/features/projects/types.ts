import type { PaginationParams } from '@/lib/api-response';

export const PROJECT_STATUSES = ['active', 'paused', 'archived'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Đang chạy',
  paused: 'Tạm dừng',
  archived: 'Lưu trữ',
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPayload = Pick<Project, 'name' | 'status' | 'owner'> & {
  description?: string;
};

export type ProjectListParams = PaginationParams & {
  keyword?: string;
  status?: ProjectStatus;
};
