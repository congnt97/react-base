import { describe, expect, it } from 'vitest';

import {
  memberSessionsSearchSchema,
  membersSearchSchema,
} from '@/features/members/search';
import { MemberRole } from '@/features/members/types';

describe('membersSearchSchema', () => {
  it('trả mặc định khi không có query param', () => {
    expect(membersSearchSchema.parse({})).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
      role: undefined,
      status: undefined,
    });
  });

  it('đưa param sai về mặc định thay vì throw', () => {
    expect(
      membersSearchSchema.parse({
        page: -1,
        pageSize: 999,
        keyword: '  ',
        role: 'god',
        status: 'x',
      }),
    ).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
      role: undefined,
      status: undefined,
    });
  });

  it('giữ param hợp lệ', () => {
    expect(
      membersSearchSchema.parse({ page: 2, keyword: ' lan ', role: 'editor' }),
    ).toMatchObject({ page: 2, keyword: 'lan', role: MemberRole.EDITOR });
  });
});

describe('memberSessionsSearchSchema', () => {
  it('mặc định 5 dòng một trang cho bảng con', () => {
    expect(memberSessionsSearchSchema.parse({})).toEqual({
      page: 1,
      pageSize: 5,
    });
  });
});
