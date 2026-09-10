import { delay, http } from 'msw';

import {
  MEMBER_ROLES,
  type Member,
  type MemberPayload,
  type MemberSession,
  type MemberStatusPayload,
} from '@/features/members/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, cycle, fail, failFields, ok, paginate } from '@/mocks/utils';

const NAMES = [
  'Lan Phạm',
  'Minh Trần',
  'Hà Nguyễn',
  'Tuấn Lê',
  'Ngọc Đỗ',
  'Huy Vũ',
  'Thu Bùi',
] as const;
const DEVICES = [
  'Chrome trên macOS',
  'Safari trên iPhone',
  'Edge trên Windows',
  'Firefox trên Ubuntu',
] as const;

const seedMembers = (count: number): Member[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2026, 1, 1 + index, 8, 0, 0)).toISOString();
    const manager = index >= 3 ? index % 3 : undefined;
    return {
      id: `m${index + 1}`,
      name: `${cycle(NAMES, index)} ${index + 1}`,
      email: `member${index + 1}@example.com`,
      role: cycle(MEMBER_ROLES, index),
      status: index % 5 === 4 ? 'inactive' : 'active',
      managerId: manager === undefined ? undefined : `m${manager + 1}`,
      managerName:
        manager === undefined
          ? undefined
          : `${cycle(NAMES, manager)} ${manager + 1}`,
      createdAt: date,
      updatedAt: date,
    };
  });

const seedSessions = (memberId: string, count: number): MemberSession[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${memberId}-s${index + 1}`,
    memberId,
    device: cycle(DEVICES, index),
    ip: `10.0.${index % 4}.${(index * 7) % 250}`,
    createdAt: new Date(Date.now() - index * 5 * 60 * 60_000).toISOString(),
  }));

// In-memory, reset khi reload trang.
let members = seedMembers(37);
const sessions = new Map(
  members.map((member, index) => [
    member.id,
    seedSessions(member.id, 12 - (index % 12)),
  ]),
);

const withManagerName = (member: Member): Member => ({
  ...member,
  managerName: member.managerId
    ? members.find((item) => item.id === member.managerId)?.name
    : undefined,
});

export const membersHandlers = [
  http.get(apiUrl(Endpoints.Members.LIST), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword')?.toLowerCase();
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');

    const filtered = members
      .filter(
        (member) =>
          !keyword ||
          member.name.toLowerCase().includes(keyword) ||
          member.email.toLowerCase().includes(keyword),
      )
      .filter((member) => !role || member.role === role)
      .filter((member) => !status || member.status === status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(withManagerName);

    return ok(paginate(filtered, url));
  }),

  http.get(apiUrl(Endpoints.Members.DETAIL), async ({ params }) => {
    await delay(300);
    const member = members.find((item) => item.id === params.id);
    return member
      ? ok(withManagerName(member))
      : fail(404, 'Không tìm thấy thành viên');
  }),

  http.get(apiUrl(Endpoints.Members.SESSIONS), async ({ params, request }) => {
    await delay(300);
    const list = sessions.get(String(params.id));
    return list
      ? ok(paginate(list, new URL(request.url)))
      : fail(404, 'Không tìm thấy thành viên');
  }),

  http.post(apiUrl(Endpoints.Members.LIST), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as MemberPayload;
    // Mẫu lỗi theo field từ backend (422): Form bọc gắn thẳng vào field email.
    if (members.some((member) => member.email === body.email)) {
      return failFields(422, 'Dữ liệu không hợp lệ', {
        email: 'Email đã tồn tại',
      });
    }
    const now = new Date().toISOString();
    const member: Member = {
      id: `m${Date.now()}`,
      ...body,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    members = [member, ...members];
    sessions.set(member.id, []);
    return ok(withManagerName(member));
  }),

  http.put(apiUrl(Endpoints.Members.DETAIL), async ({ request, params }) => {
    await delay(300);
    const existing = members.find((member) => member.id === params.id);
    if (!existing) {
      return fail(404, 'Không tìm thấy thành viên');
    }
    const body = (await request.json()) as MemberPayload;
    const updated: Member = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    members = members.map((member) =>
      member.id === updated.id ? updated : member,
    );
    return ok(withManagerName(updated));
  }),

  http.patch(apiUrl(Endpoints.Members.STATUS), async ({ request }) => {
    await delay(300);
    const { ids, status } = (await request.json()) as MemberStatusPayload;
    const now = new Date().toISOString();
    members = members.map((member) =>
      ids.includes(member.id) ? { ...member, status, updatedAt: now } : member,
    );
    return ok(null);
  }),

  http.delete(apiUrl(Endpoints.Members.DETAIL), async ({ params }) => {
    await delay(300);
    if (!members.some((member) => member.id === params.id)) {
      return fail(404, 'Không tìm thấy thành viên');
    }
    members = members.filter((member) => member.id !== params.id);
    return ok(null);
  }),
];
