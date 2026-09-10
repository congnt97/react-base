// Sinh feature CRUD mới đúng cấu trúc, naming và wiring của base.
// Dùng: pnpm gen <tên-kebab-số-nhiều>   ví dụ: pnpm gen orders
//
// Nguyên tắc: output phải xanh ngay (pnpm validate && pnpm test), không sinh code
// chết, không để chuỗi chưa dịch. Nhãn hiển thị dùng tạm tên feature; đổi sau.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const rawName = process.argv[2];

if (!rawName || !/^[a-z][a-z0-9-]*$/.test(rawName)) {
  console.error(
    'Dùng: pnpm gen <tên-feature-kebab-case-số-nhiều>\nVí dụ: pnpm gen orders',
  );
  process.exit(1);
}

const kebab = rawName;
const pascal = kebab
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');
const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
// Danh từ số ít cho một bản ghi: orders -> Order. Sửa tay nếu tiếng Anh bất quy tắc.
const entity = pascal.endsWith('s') ? pascal.slice(0, -1) : pascal;
const entityCamel = entity.charAt(0).toLowerCase() + entity.slice(1);

const featureDir = path.resolve('src/features', kebab);
if (existsSync(featureDir)) {
  console.error(`src/features/${kebab} đã tồn tại.`);
  process.exit(1);
}

// Nhãn tạm: dùng tên feature để code xanh ngay; đổi sang tiếng Việt thật sau.
const labels = {
  title: pascal,
  name: `Tên ${camel}`,
  create: `Tạo ${camel}`,
  edit: `Sửa ${camel}`,
  empty: `Chưa có ${camel}`,
  emptyHint: `Tạo mục đầu tiên để bắt đầu.`,
  created: `Đã tạo ${camel}`,
  updated: `Đã cập nhật ${camel}`,
  deleted: `Đã xoá ${camel}`,
  deleteTitle: `Xoá "{{name}}"?`,
  requireName: `Nhập tên ${camel}`,
  total: `{{total}} ${camel}`,
};

const files = new Map();

files.set(
  `src/features/${kebab}/types.ts`,
  `import type { PaginationParams } from '@/lib/api-response';

export type ${entity} = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ${entity}Payload = Pick<${entity}, 'name'>;

export type ${entity}ListParams = PaginationParams & {
  keyword?: string;
};
`,
);

files.set(
  `src/features/${kebab}/api.ts`,
  `import type {
  ${entity},
  ${entity}ListParams,
  ${entity}Payload,
} from '@/features/${kebab}/types';
import {
  unwrapResponse,
  type ApiResponse,
  type PaginatedResponse,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http, type HttpRequestOptions } from '@/lib/http';

type ReadOptions = Pick<HttpRequestOptions, 'signal'>;

// Contract tường minh: đọc interface là biết feature nói chuyện với backend thế nào.
export interface ${pascal}Api {
  list: (
    params: ${entity}ListParams,
    options?: ReadOptions,
  ) => Promise<PaginatedResponse<${entity}>>;
  create: (body: ${entity}Payload) => Promise<${entity}>;
  update: (id: string, body: ${entity}Payload) => Promise<${entity}>;
  remove: (id: string) => Promise<void>;
}

export const ${camel}Api: ${pascal}Api = {
  list: async (params, options) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<${entity}>>>(
        Endpoints.${pascal}.LIST,
        { queryParams: params, signal: options?.signal },
      ),
    ),

  create: async (body) =>
    unwrapResponse(
      await http.post<ApiResponse<${entity}>, ${entity}Payload>(
        Endpoints.${pascal}.LIST,
        body,
      ),
    ),

  update: async (id, body) =>
    unwrapResponse(
      await http.put<ApiResponse<${entity}>, ${entity}Payload>(
        Endpoints.${pascal}.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  remove: async (id) => {
    await http.delete<ApiResponse<void>>(Endpoints.${pascal}.DETAIL, undefined, {
      urlParams: { id },
    });
  },
};
`,
);

files.set(
  `src/features/${kebab}/search.ts`,
  `import { z } from 'zod';

// \`.catch\` thay vì throw: query param sai/thiếu thì về mặc định, không văng lỗi route.
export const ${camel}SearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
});

export type ${pascal}Search = z.infer<typeof ${camel}SearchSchema>;
`,
);

files.set(
  `src/features/${kebab}/search.test.ts`,
  `import { describe, expect, it } from 'vitest';

import { ${camel}SearchSchema } from '@/features/${kebab}/search';

describe('${camel}SearchSchema', () => {
  it('trả mặc định khi không có query param', () => {
    expect(${camel}SearchSchema.parse({})).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
    });
  });

  it('đưa param sai về mặc định thay vì throw', () => {
    expect(
      ${camel}SearchSchema.parse({ page: 0, pageSize: 999, keyword: '  ' }),
    ).toEqual({ page: 1, pageSize: 10, keyword: undefined });
  });
});
`,
);

files.set(
  `src/features/${kebab}/hooks/use-${kebab}.ts`,
  `import { useListQuery } from '@/core/hooks/use-list-query';
import { ${camel}Api } from '@/features/${kebab}/api';
import type { ${entity}ListParams } from '@/features/${kebab}/types';

// Key factory: invalidate \`all\` sau mutation là đủ cho mọi trang/filter.
export const ${entityCamel}Keys = {
  all: ['${kebab}'] as const,
  list: (params: ${entity}ListParams) =>
    [...${entityCamel}Keys.all, 'list', params] as const,
};

type Use${pascal}Options = {
  /** Xoá dòng cuối của trang cuối thì lùi về trang còn dữ liệu. */
  onPageOverflow: (lastPage: number) => void;
};

// useListQuery lo: isLoading đúng nghĩa, giữ data cũ khi đổi trang, huỷ request cũ.
export function use${pascal}(
  params: ${entity}ListParams,
  { onPageOverflow }: Use${pascal}Options,
) {
  return useListQuery({
    queryKey: ${entityCamel}Keys.list(params),
    queryFn: ({ signal }) => ${camel}Api.list(params, { signal }),
    page: params.page,
    pageSize: params.pageSize,
    onPageOverflow,
  });
}
`,
);

files.set(
  `src/features/${kebab}/hooks/use-${kebab}-mutations.ts`,
  `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { ${camel}Api } from '@/features/${kebab}/api';
import { ${entityCamel}Keys } from '@/features/${kebab}/hooks/use-${kebab}';
import type { ${entity}Payload } from '@/features/${kebab}/types';
import { getErrorMessage } from '@/lib/api-error';

function useMutationFeedback(successMessage: string) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      message.success(t(successMessage));
      return queryClient.invalidateQueries({ queryKey: ${entityCamel}Keys.all });
    },
    onError: (error: unknown) => {
      message.error(t(getErrorMessage(error)));
    },
  };
}

export function useCreate${entity}() {
  return useMutation({
    mutationFn: ${camel}Api.create,
    ...useMutationFeedback('${labels.created}'),
  });
}

export function useUpdate${entity}() {
  return useMutation({
    mutationFn: ({ id, ...body }: ${entity}Payload & { id: string }) =>
      ${camel}Api.update(id, body),
    ...useMutationFeedback('${labels.updated}'),
  });
}

export function useDelete${entity}() {
  return useMutation({
    mutationFn: ${camel}Api.remove,
    ...useMutationFeedback('${labels.deleted}'),
  });
}
`,
);

files.set(
  `src/features/${kebab}/components/${kebab}-table.tsx`,
  `import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Space, type TableProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ListState } from '@/core/contracts';
import type { ${entity} } from '@/features/${kebab}/types';
import { formatDateTime } from '@/lib/format';

type ${pascal}TableProps = {
  list: ListState<${entity}>;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  emptyState: ReactNode;
  // undefined = không có quyền, ẩn control tương ứng.
  onEdit?: (item: ${entity}) => void;
  onDelete?: (item: ${entity}) => void;
};

export function ${pascal}Table({
  list,
  page,
  pageSize,
  onPageChange,
  emptyState,
  onEdit,
  onDelete,
}: ${pascal}TableProps) {
  const { t } = useTranslation();

  const columns: TableProps<${entity}>['columns'] = [
    { title: t('${labels.name}'), dataIndex: 'name' },
    {
      title: t('Cập nhật'),
      dataIndex: 'updatedAt',
      width: 160,
      render: (value: string) => formatDateTime(value),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      title: '',
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, item) => (
        <Space size={0}>
          {onEdit ? (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label={t('Sửa {{name}}', { name: item.name })}
              onClick={() => onEdit(item)}
            />
          ) : null}
          {onDelete ? (
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              aria-label={t('Xoá {{name}}', { name: item.name })}
              onClick={() => onDelete(item)}
            />
          ) : null}
        </Space>
      ),
    });
  }

  return (
    <DataTable<${entity}>
      rowKey="id"
      columns={columns}
      list={list}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      emptyState={emptyState}
      showTotal={(total) => t('${labels.total}', { total })}
    />
  );
}
`,
);

files.set(
  `src/features/${kebab}/components/${entityCamel}-form-modal.tsx`,
  `import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';
import type { ${entity}, ${entity}Payload } from '@/features/${kebab}/types';

type ${entity}FormModalProps = {
  open: boolean;
  item: ${entity} | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ${entity}Payload) => void;
};

const DEFAULT_VALUES: ${entity}Payload = { name: '' };

export function ${entity}FormModal({
  open,
  item,
  submitting,
  onCancel,
  onSubmit,
}: ${entity}FormModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<${entity}Payload>();
  const isEdit = Boolean(item);

  return (
    <Modal
      open={open}
      title={isEdit ? t('${labels.edit}') : t('${labels.create}')}
      okText={isEdit ? t('Lưu') : t('${labels.create}')}
      cancelText={t('Huỷ')}
      // Modal bọc: đang gửi thì khoá mask/ESC/X, huỷ form khi đóng để initialValues đúng.
      submitting={submitting}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form<${entity}Payload>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={item ?? DEFAULT_VALUES}
        onFinish={onSubmit}
      >
        <Form.Item
          label={t('${labels.name}')}
          name="name"
          rules={[{ required: true, message: t('${labels.requireName}') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
`,
);

files.set(
  `src/features/${kebab}/pages/${kebab}-page.tsx`,
  `import { PlusOutlined } from '@ant-design/icons';
import { getRouteApi } from '@tanstack/react-router';
import { Card } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/use-confirm';
import { ${entity}FormModal } from '@/features/${kebab}/components/${entityCamel}-form-modal';
import { ${pascal}Table } from '@/features/${kebab}/components/${kebab}-table';
import {
  useCreate${entity},
  useDelete${entity},
  useUpdate${entity},
} from '@/features/${kebab}/hooks/use-${kebab}-mutations';
import { use${pascal} } from '@/features/${kebab}/hooks/use-${kebab}';
import type { ${pascal}Search } from '@/features/${kebab}/search';
import type { ${entity}, ${entity}Payload } from '@/features/${kebab}/types';

const route = getRouteApi('/_app/${kebab}/');

type FormState = { open: boolean; item: ${entity} | null };

export function ${pascal}Page() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const search = route.useSearch();
  const navigate = route.useNavigate();

  // URL là source of truth cho filter/pagination: share link, back/forward đều đúng.
  const updateSearch = (patch: Partial<${pascal}Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const query = use${pascal}(search, {
    onPageOverflow: (page) => void updateSearch({ page }),
  });
  const create${entity} = useCreate${entity}();
  const update${entity} = useUpdate${entity}();
  const delete${entity} = useDelete${entity}();

  const [form, setForm] = useState<FormState>({ open: false, item: null });
  const closeForm = () => setForm({ open: false, item: null });
  const openCreate = () => setForm({ open: true, item: null });

  const handleSubmit = (values: ${entity}Payload) => {
    const mutation = form.item
      ? update${entity}.mutateAsync({ id: form.item.id, ...values })
      : create${entity}.mutateAsync(values);
    // Lỗi đã được toast trong hook; ở đây chỉ cần giữ modal mở khi thất bại.
    void mutation.then(closeForm, () => undefined);
  };

  const confirmDelete = (item: ${entity}) =>
    confirm({
      title: t('${labels.deleteTitle}', { name: item.name }),
      content: t('Hành động này không thể hoàn tác.'),
      okText: t('Xoá'),
      cancelText: t('Huỷ'),
      danger: true,
      // Lỗi đã toast trong mutation; kết quả true/false không cần xử lý thêm.
      onConfirm: () => delete${entity}.mutateAsync(item.id),
    });

  return (
    <>
      <PageHeader
        title={t('${labels.title}')}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('${labels.create}')}
          </Button>
        }
      />

      <Card className="app-card">
        {query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : (
          <${pascal}Table
            list={query}
            page={search.page}
            pageSize={search.pageSize}
            onPageChange={(page, pageSize) =>
              void updateSearch({ page, pageSize })
            }
            emptyState={
              <EmptyState
                title={t('${labels.empty}')}
                description={t('${labels.emptyHint}')}
                action={{
                  label: t('${labels.create}'),
                  icon: <PlusOutlined />,
                  onClick: openCreate,
                }}
              />
            }
            onEdit={(item) => setForm({ open: true, item })}
            onDelete={(item) => void confirmDelete(item)}
          />
        )}
      </Card>

      <${entity}FormModal
        open={form.open}
        item={form.item}
        submitting={create${entity}.isPending || update${entity}.isPending}
        onCancel={closeForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
`,
);

files.set(
  `src/routes/_app/${kebab}/index.tsx`,
  `import { createFileRoute } from '@tanstack/react-router';

import { ${pascal}Page } from '@/features/${kebab}/pages/${kebab}-page';
import { ${camel}SearchSchema } from '@/features/${kebab}/search';

export const Route = createFileRoute('/_app/${kebab}/')({
  component: ${pascal}Page,
  validateSearch: (search) => ${camel}SearchSchema.parse(search),
});
`,
);

files.set(
  `src/mocks/handlers/${kebab}.ts`,
  `import { delay, http } from 'msw';

import type { ${entity}, ${entity}Payload } from '@/features/${kebab}/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

// In-memory, reset khi reload trang.
let items: ${entity}[] = Array.from({ length: 12 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 0, 1 + index, 9)).toISOString();
  return {
    id: \`\${index + 1}\`,
    name: \`${entity} \${index + 1}\`,
    createdAt: date,
    updatedAt: date,
  };
});

export const ${camel}Handlers = [
  http.get(apiUrl(Endpoints.${pascal}.LIST), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const keyword = url.searchParams.get('keyword')?.toLowerCase();

    const filtered = items.filter(
      (item) => !keyword || item.name.toLowerCase().includes(keyword),
    );
    const start = (page - 1) * pageSize;

    return ok({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  http.get(apiUrl(Endpoints.${pascal}.DETAIL), async ({ params }) => {
    await delay(300);
    const item = items.find((entry) => entry.id === params.id);
    return item ? ok(item) : fail(404, 'Không tìm thấy');
  }),

  http.post(apiUrl(Endpoints.${pascal}.LIST), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as ${entity}Payload;
    const now = new Date().toISOString();
    const item: ${entity} = {
      id: \`\${Date.now()}\`,
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    items = [item, ...items];
    return ok(item);
  }),

  http.put(apiUrl(Endpoints.${pascal}.DETAIL), async ({ request, params }) => {
    await delay(300);
    const existing = items.find((entry) => entry.id === params.id);
    if (!existing) {
      return fail(404, 'Không tìm thấy');
    }

    const body = (await request.json()) as ${entity}Payload;
    const updated: ${entity} = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    items = items.map((entry) => (entry.id === updated.id ? updated : entry));
    return ok(updated);
  }),

  http.delete(apiUrl(Endpoints.${pascal}.DETAIL), async ({ params }) => {
    await delay(300);
    if (!items.some((entry) => entry.id === params.id)) {
      return fail(404, 'Không tìm thấy');
    }
    items = items.filter((entry) => entry.id !== params.id);
    return ok(null);
  }),
];
`,
);

for (const [file, content] of files) {
  const full = path.resolve(file);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content);
}

/** Chèn `insert` vào trước dòng khớp `anchor`, bỏ qua nếu đã có `marker`. */
const patchFile = (file, anchor, insert, marker) => {
  const full = path.resolve(file);
  const source = readFileSync(full, 'utf8');
  if (source.includes(marker)) {
    return;
  }
  writeFileSync(full, source.replace(anchor, insert));
};

patchFile(
  'src/lib/endpoints.ts',
  /^} as const;$/m,
  `  ${pascal}: {
    LIST: '/${kebab}',
    DETAIL: '/${kebab}/:id',
  },
} as const;`,
  `${pascal}: {`,
);

patchFile(
  'src/mocks/handlers/index.ts',
  /^import { authHandlers/m,
  `import { authHandlers`.replace(
    'import { authHandlers',
    `import { ${camel}Handlers } from '@/mocks/handlers/${kebab}';\nimport { authHandlers`,
  ),
  `${camel}Handlers`,
);

patchFile(
  'src/mocks/handlers/index.ts',
  /^export const handlers = \[$/m,
  `export const handlers = [\n  ...${camel}Handlers,`,
  `...${camel}Handlers`,
);

// Thêm key i18n để `pnpm test` xanh ngay; nội dung tiếng Anh dịch sau.
const localePath = path.resolve('src/locales/en.json');
const locale = JSON.parse(readFileSync(localePath, 'utf8'));
for (const label of Object.values(labels)) {
  locale[label] ??= label;
}
writeFileSync(localePath, `${JSON.stringify(locale, null, 2)}\n`);

console.log(`Đã tạo feature "${kebab}":\n`);
for (const file of files.keys()) {
  console.log(`  ${file}`);
}
console.log(`
Đã nối vào: src/lib/endpoints.ts, src/mocks/handlers/index.ts, src/locales/en.json

Việc cần làm tiếp:
  1. pnpm exec vite build   (sinh lại routeTree.gen.ts)
  2. Sửa type ${entity} trong types.ts cho khớp backend, cột trong ${kebab}-table.tsx
     và field trong ${entityCamel}-form-modal.tsx.
  3. Đổi nhãn tạm ("${labels.title}", "${labels.create}"...) sang tiếng Việt thật,
     cập nhật src/locales/en.json.
  4. Thêm menu vào src/app/layout/sidebar.tsx; nếu cần phân quyền thì thêm
     '${kebab}:read|create|update|delete' vào features/auth/permissions.ts và bọc
     nút bằng <Can>.
  5. pnpm validate && pnpm test`);
