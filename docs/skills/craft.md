# Craft Rules: tay nghề lập trình viên

Đọc cho mọi task viết hoặc sửa code. Đây là phần không phụ thuộc dự án: logic đúng, code sạch, tối ưu có đo, cú pháp hiện đại.

## Máy đã ép

- Cú pháp: `===`, `const`, template string, object shorthand, `?.`/`??` thay `&&`/`||` khi phù hợp, không `var`.
- Cấu trúc: không ternary lồng, không `else` sau `return`, không mutate tham số, lồng tối đa 3 tầng, hàm phức tạp (cyclomatic) tối đa 12, tối đa 4 tham số, file tối đa 400 dòng.
- Logic: `switch` phải đủ case cho union, điều kiện luôn đúng/luôn sai là lỗi, promise không được bỏ lửng, `arr[i]` phải xử lý undefined.
- Sạch: không code chết (knip), không `console.log`, không warning.

Gặp lỗi complexity hay max-lines thì tách hàm hoặc component, không nới ngưỡng. Mẫu tách: `features/projects/hooks/use-project-form.ts` (tách luồng submit khỏi page), `lib/http.ts` (`canRetryWithRefresh`, `toApiError` tách khỏi interceptor).

## Logic đúng

Trước khi viết, liệt kê các trạng thái đầu vào và xử lý đủ:

- Rỗng, `0`, `''`, `false`, `null`, `undefined`: phân biệt "chưa có" và "có nhưng bằng không".
- Loading, lỗi, rỗng, có data: mỗi màn hình đủ 4 nhánh.
- Đồng thời: request cũ về sau request mới (truyền `signal`), bấm hai lần (bind `loading`), nhiều 401 cùng lúc (đã gom refresh).
- Biên: trang cuối, trang vượt tổng, ký tự có dấu trong URL và header, timezone khi format ngày.
- Bất biến: không mutate object từ Query cache hay props; tạo bản mới.
- Đọc code có sẵn trước khi gọi: kiểm type thật, không đoán tên field hay tên hàm.

## Code sạch

- Một hàm một việc, đặt tên theo việc đó. Hàm dài hơn một màn hình là dấu hiệu tách.
- Early return cho trường hợp đặc biệt, để luồng chính không bị thụt sâu.
- Không magic number: đặt tên hằng có đơn vị (`REFRESH_TIMEOUT_MS`), trừ 0, 1 và giá trị hiển nhiên trong layout.
- Comment nói _vì sao_, không nói _cái gì_. Code tự giải thích thì không comment.
- Không trừu tượng hoá sớm: lặp hai lần chấp nhận được, lần thứ ba mới gom. Không tạo helper "để sau dùng".
- Không để lại code thử nghiệm, biến không dùng, import thừa, `TODO` không có ticket.

## Tối ưu có đo

- Không tối ưu trước khi đo. Nghi ngờ thì đo bằng React DevTools Profiler, `pnpm build:analyze`, hoặc Network tab.
- Nhìn độ phức tạp: lồng vòng lặp trên danh sách lớn, tìm trong mảng thay vì `Map`/`Set`, tính lại trong mỗi lần render thứ có thể tính một lần.
- Không làm việc nặng trong render; không tạo hàm/object mới truyền xuống nếu không cần (compiler đã memo, nhưng không sửa được thuật toán xấu).
- Data lớn: phân trang server, `keepPreviousData`, lazy load component nặng.

## Cú pháp và chuẩn

- TypeScript hiện đại: `satisfies`, `as const`, union thay enum khi có thể, `readonly` cho tham số không sửa.
- `async/await` thay `.then` lồng; `Promise.all` cho việc độc lập.
- Destructuring có chừng mực: không destructure quá 5 field, không destructure sâu làm mất ngữ cảnh.
- Import theo thứ tự: package ngoài, rồi `@/` nội bộ, cách nhau một dòng trắng (prettier không sắp import; giữ tay).
- Không viết lại thứ đã có trong lib: `format`, `url`, `debounce`, `api-error`.

## Trước khi nộp

Đọc lại diff như người review: mỗi dòng đổi có lý do không, có xoá được thêm gì không, test có che đúng nhánh vừa thêm không, có gì chỉ chạy đúng trong mock mà không đúng với backend thật không.
