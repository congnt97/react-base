# TypeScript Discipline Rules

Đọc file này khi task tạo/sửa type, interface, generic, DTO, response API, hoặc khi gặp lỗi TypeScript cần fix.

`tsconfig.json` đã bật `strict`, `noUnusedLocals`, `noUnusedParameters`. Mục tiêu là giữ type an toàn thật, không chỉ để build pass.

## Không Dùng `any` Để Né Lỗi

Không làm:

```ts
const handleResponse = (data: any) => {
  return data.items.map((item: any) => item.name);
};
```

Nên làm — định nghĩa type rõ ràng, hoặc dùng `unknown` + narrow nếu chưa biết hình dạng data:

```ts
type ListResponse = { items: { name: string }[] };

const handleResponse = (data: ListResponse) =>
  data.items.map((item) => item.name);
```

Chỉ chấp nhận `any` khi tương tác thư viện ngoài không có type và không thể tránh, kèm comment ngắn giải thích lý do.

## Không Ép Kiểu Để Né Lỗi

Không làm:

```ts
const user = response as unknown as AuthUser;
```

Nếu type không khớp, sửa type gốc (response DTO, generic của hàm gọi) hoặc dùng type guard/validation (`zod`) thay vì ép kiểu im lặng.

## Non-Null Assertion (`!`)

Hạn chế tối đa `!`. Chỉ chấp nhận khi chắc chắn tuyệt đối theo invariant của hệ thống (vd: giá trị được inject bắt buộc lúc bootstrap trước khi render), và nên kèm comment ngắn giải thích vì sao chắc chắn không null.

Không làm tùy tiện:

```ts
const id = params.id!;
```

Nên làm — kiểm tra thật hoặc để router/schema đảm bảo required:

```ts
if (!params.id) {
  throw new Error('Thiếu id');
}
```

## Response API Phải Có Type Rõ Ràng

Không để TS suy luận ngầm kiểu response. Repository method phải khai báo generic/return type rõ (xem `docs/skills/api.md`).

Không làm:

```ts
export const getProjects = () => httpClient.get('/projects');
```

Nên làm:

```ts
export const getProjects = () =>
  httpClient.get<ResponseCommon<Project[]>>(Endpoints.Projects.LIST);
```

## Không Định Nghĩa Type Trùng Lặp

Nếu 1 type là tập con/biến thể của model gốc, derive bằng `Pick`/`Omit`/`Partial`, không copy field tay:

Không làm:

```ts
type ProjectSummary = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};
```

Nên làm:

```ts
type ProjectSummary = Pick<Project, 'id' | 'name'>;
```

## Optional Chaining/`??` Không Che Lỗi Logic

`?.`/`??` dùng để xử lý optional data hợp lệ, không dùng để né kiểm tra required data còn thiếu. Xem rule fallback đầy đủ ở `docs/skills/quality.md`.

## Không Tắt Strict Check Để Né Lỗi

Không thêm `// @ts-ignore`, `// @ts-expect-error` không rõ lý do, hoặc nới lỏng `tsconfig.json` (`strict`, `noUnusedLocals`, `noUnusedParameters`) để né lỗi build. Sửa code gốc thay vì tắt check.

## Rule Ngắn

```text
any -> chỉ khi bắt buộc, có comment lý do.
as unknown as X -> sửa type gốc thay vì ép kiểu.
! -> hạn chế tối đa, có comment khi dùng.
Response API -> luôn có type/generic rõ ràng.
Type trùng -> derive bằng Pick/Omit/Partial từ model gốc.
```
