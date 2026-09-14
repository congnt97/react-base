import type { PaginationParams } from '@/lib/api-response';

// Tập giá trị đóng đi qua enum, không rải chuỗi trần trong code: gán sai là lỗi
// biên dịch, đổi tên chỉ sửa một chỗ, và IDE gợi ý đủ giá trị hợp lệ.
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
