# TypeScript Rules

Đọc khi tạo/sửa type, generic, response type, hoặc gặp lỗi TS.

## Máy đã ép

`strict`, `noUncheckedIndexedAccess`, typed lint: `any`, `!`, `@ts-ignore`, gán/gọi giá trị `any`, `arr[i]` không check undefined, promise bỏ lửng đều là lỗi. Sửa code, không nới `tsconfig`.

## Rule cần phán đoán

- Type không khớp thì sửa type gốc (payload, generic của `http`), không `as unknown as X`. Cần narrow từ `unknown` thì dùng type guard hoặc zod.
- Response API luôn có generic rõ: `http.get<ApiResponse<Project[]>>(...)`. Không để TS suy luận ngầm.
- Type là tập con của model thì derive: `Pick<Project, 'id' | 'name'>`, không copy field.
- `?.` và `??` cho optional hợp lệ, không để né kiểm tra required. Xem `quality.md` mục Fallback.
- Hậu tố type theo `naming.md`: `Payload`, `ListParams`, `Search`, `Props`, `Api`, `State`.
- `as const` array + union là mặc định cho tập giá trị cố định; `enum` chỉ khi cần giá trị runtime ở nhiều tầng.
