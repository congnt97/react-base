import { describe, expect, it } from 'vitest';

import { projectsSearchSchema } from '@/features/projects/search';
import { ProjectStatus } from '@/features/projects/types';

describe('projectsSearchSchema', () => {
  it('trả mặc định khi không có query param', () => {
    expect(projectsSearchSchema.parse({})).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
      status: undefined,
    });
  });

  it('giữ param hợp lệ', () => {
    expect(
      projectsSearchSchema.parse({
        page: 3,
        pageSize: 20,
        keyword: 'cms',
        status: 'paused',
      }),
    ).toEqual({
      page: 3,
      pageSize: 20,
      keyword: 'cms',
      status: ProjectStatus.PAUSED,
    });
  });

  it('đưa param sai về mặc định thay vì throw', () => {
    expect(
      projectsSearchSchema.parse({
        page: 0,
        pageSize: 999,
        keyword: '   ',
        status: 'unknown',
      }),
    ).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
      status: undefined,
    });
  });
});
