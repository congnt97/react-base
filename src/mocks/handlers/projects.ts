import { delay, http } from 'msw';

import {
  PROJECT_STATUSES,
  type Project,
  type ProjectPayload,
} from '@/features/projects/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

const OWNERS = ['Lan', 'Minh', 'Hà', 'Tuấn', 'Ngọc'];

const seedProjects = (count: number): Project[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, 1 + index, 9, 0, 0)).toISOString();
    return {
      id: `p${index + 1}`,
      name: `Dự án ${index + 1}`,
      status: PROJECT_STATUSES[index % PROJECT_STATUSES.length],
      owner: OWNERS[index % OWNERS.length],
      description: index % 3 === 0 ? 'Mô tả ngắn cho dự án mẫu.' : undefined,
      createdAt: date,
      updatedAt: date,
    };
  });

// In-memory, reset khi reload trang.
let projects = seedProjects(23);

export const projectsHandlers = [
  http.get(apiUrl(Endpoints.Projects.LIST), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const keyword = url.searchParams.get('keyword')?.toLowerCase();
    const status = url.searchParams.get('status');

    const filtered = projects
      .filter(
        (project) => !keyword || project.name.toLowerCase().includes(keyword),
      )
      .filter((project) => !status || project.status === status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    const start = (page - 1) * pageSize;
    return ok({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  http.post(apiUrl(Endpoints.Projects.LIST), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as ProjectPayload;
    const now = new Date().toISOString();
    const project: Project = {
      id: `p${Date.now()}`,
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    projects = [project, ...projects];
    return ok(project);
  }),

  http.put(apiUrl(Endpoints.Projects.DETAIL), async ({ request, params }) => {
    await delay(300);
    const existing = projects.find((project) => project.id === params.id);
    if (!existing) {
      return fail(404, 'Không tìm thấy dự án');
    }

    const body = (await request.json()) as ProjectPayload;
    const updated: Project = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    projects = projects.map((project) =>
      project.id === updated.id ? updated : project,
    );
    return ok(updated);
  }),

  http.delete(apiUrl(Endpoints.Projects.DETAIL), async ({ params }) => {
    await delay(300);
    if (!projects.some((project) => project.id === params.id)) {
      return fail(404, 'Không tìm thấy dự án');
    }

    projects = projects.filter((project) => project.id !== params.id);
    return ok(null);
  }),
];
