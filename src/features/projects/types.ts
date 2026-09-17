import type { PaginationParams } from '@/lib/api-response';

// A closed set of values goes through an enum instead of raw strings scattered in code: a
// wrong assignment is a compile error, a rename touches one place, and the IDE suggests
// every valid value.
export enum ProjectStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: 'Đang chạy',
  [ProjectStatus.PAUSED]: 'Tạm dừng',
  [ProjectStatus.ARCHIVED]: 'Lưu trữ',
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
  description?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPayload = Pick<Project, 'name' | 'status' | 'owner'> & {
  description?: string;
  attachmentUrl?: string;
};

export type ProjectListParams = PaginationParams & {
  keyword?: string;
  status?: ProjectStatus;
};
