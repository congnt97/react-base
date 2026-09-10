# Quyết định thiết kế và lý do

Mỗi mục: quyết định, bối cảnh, lựa chọn đã cân nhắc, hệ quả. Đọc khi muốn đổi một trong những điều này; đổi thì cập nhật mục tương ứng trong cùng PR.

## 1. Feature-first thay vì Clean Architecture nhiều tầng

**Quyết định**: mỗi feature một folder tự chứa `types/api/search/hooks/components/pages`; không có tầng domain, usecase, repository, DI container.

**Bối cảnh**: phiên bản đầu của base có đủ tầng và DI. Mỗi màn hình CRUD cần chạm 8 đến 10 file ở 4 folder khác nhau; người mới và AI đều đặt code sai chỗ.

**Cân nhắc**: giữ Clean Architecture (đúng lý thuyết, nhưng chi phí cao cho app CMS mà logic nghiệp vụ nằm ở backend); feature-first (ít tầng, mỗi feature đọc từ trên xuống là hiểu).

**Hệ quả**: contract với backend nằm ở `interface <X>Api` trong `api.ts`, đủ tường minh để thay implementation. Logic nghiệp vụ thuần (nếu có) đặt trong `lib/` hoặc file thuần trong feature, có test. Không có chỗ cho "service layer" chung; ai cần thì tạo trong feature.

## 2. Tầng `core/` headless, không phụ thuộc thư viện UI

**Quyết định**: hành vi dễ sai (chặn click trùng, loading đúng, trang tràn, huỷ request cũ, debounce, chọn nhánh loading/lỗi/rỗng) nằm trong `src/core/`, chỉ import `lib/`, không import Ant Design.

**Bối cảnh**: base phải là lõi dùng lại được với Ant Design, MUI, shadcn hay bất kỳ thư viện bảng nào. Nếu hành vi nằm trong component Ant Design, đổi thư viện là viết lại và mắc lại đủ lỗi.

**Cân nhắc**: viết hành vi trong từng feature (lặp, ai quên là lỗi); bọc toàn bộ Ant Design (bloat, che API gốc); tách hành vi ra hook headless + adapter mỏng (chọn).

**Hệ quả**: `core/` có coverage bắt buộc và test hành vi; ESLint chặn `core/` và `lib/` import thư viện UI qua `UI_LIBS`. Thêm hành vi mới phải kèm test và một dòng trong `pitfalls.md`.

## 3. Rào ESLint có mục tiêu, không bọc toàn bộ thư viện UI

**Quyết định**: feature chỉ bị chặn import thẳng 7 tên `Button, Modal, Table, Popconfirm, Upload, Drawer, Form` (mảng `WRAPPED_UI` trong `eslint.config.js`). Các component khác import thẳng từ `antd`.

**Bối cảnh**: cân nhắc chặn toàn bộ `antd` trong feature và re-export qua một barrel. Lo ngại file phình và HMR chậm.

**Cân nhắc**: một file barrel trong `components/ui/` re-export mọi thứ (không thêm byte cho bundle vì tree-shaking, nhưng Vite phải theo dõi cả module lớn cho HMR, và tree-shaking kém hơn với re-export có side effect); một file một adapter, chỉ chặn tên có hành vi (chọn).

**Hệ quả**: thêm component có hành vi dễ sai thì thêm tên vào `WRAPPED_UI`, viết adapter và test. Component thuần hiển thị không bọc. Thông báo lỗi của rule ghi rõ đường thay thế.

## 4. Guard bằng Vitest, E2E chỉ cho luồng chính

**Quyết định**: hành vi của core và adapter được kiểm bằng test component Vitest chạy trong `pnpm test`. Playwright chỉ giữ luồng chính, chạy khi merge `main`, PR gắn label `e2e`, hoặc chạy tay.

**Bối cảnh**: E2E nặng (Chromium, vài phút) và ít người chạy trước khi push. Guard mà không ai chạy thì không phải guard.

**Hệ quả**: mọi lỗi hành vi mới phải chặn được ở tầng Vitest. E2E mock in-memory dùng chung giữa test chạy song song, nên assertion không dựa vào tổng số dòng.

## 5. Rule cho AI nằm ở một file, các tool khác chỉ trỏ tới

**Quyết định**: `AGENTS.md` là nguồn duy nhất; `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/base.mdc`, `.github/copilot-instructions.md` chỉ import hoặc trỏ tới nó. `SKILLS.md` là bảng router chọn rule phụ; mỗi file rule phụ mở đầu bằng khối "Máy đã ép".

**Bối cảnh**: nhiều tool AI, mỗi tool một file cấu hình. Copy rule ra nhiều nơi là lệch sau vài tuần.

**Hệ quả**: đổi rule chỉ sửa một file. Phần rule có thể máy bắt thì chuyển thành lint hoặc test rồi xoá khỏi docs; docs chỉ giữ phần cần phán đoán.

## 6. Hook lint ngay sau khi AI sửa file

**Quyết định**: Claude Code (`PostToolUse`) và Cursor (`afterFileEdit`) chạy `scripts/lint-changed-file.mjs`: eslint --fix và prettier trên đúng file vừa sửa, lỗi còn lại trả về cho AI.

**Bối cảnh**: AI thấy lỗi càng sớm càng ít lan; đợi tới `pnpm validate` cuối task thì đã sửa nhiều file trên nền sai.

**Hệ quả**: Copilot và Codex chưa có cơ chế hook tương đương; với họ guard là pre-commit và CI. Script không chặn ghi file, chỉ báo.

## 7. Bug thật phải để lại guard và một dòng pitfalls

**Quyết định**: PR sửa bug production hoặc bug lọt review phải kèm một guard (test hành vi, rule lint, hoặc test đối chiếu) và một dòng trong `docs/skills/pitfalls.md`. PR template có checkbox.

**Bối cảnh**: 83 lỗi hay gặp được liệt kê ban đầu; không có cơ chế nuôi danh sách thì nó cũ sau một quý.

**Hệ quả**: `pitfalls.md` là log sống của dự án. `src/test/pitfalls.test.ts` giữ cho đường dẫn trong đó không mục.

## 8. Sửa guard phải có label `guards`

**Quyết định**: CI đỏ khi PR đụng `eslint.config.js`, `vitest.config.ts`, `tsconfig.json`, `scripts/`, `.github/`, `knip.json`, `pnpm-workspace.yaml` mà không gắn label `guards`.

**Bối cảnh**: cách nhanh nhất để "xanh" là nới rule. Không cấm, nhưng phải là quyết định thấy được.

## 9. URL là nguồn sự thật cho filter và phân trang

**Quyết định**: mọi list, kể cả bảng con trên trang chi tiết, đọc `page/pageSize/filter` từ `validateSearch` và đổi bằng `navigate({ search })`. Schema zod dùng `.catch` để param sai về mặc định.

**Hệ quả**: share link, back/forward, reload đều đúng. Không có `useState` cho filter. Đổi filter thì `page: 1`; chọn nhiều dòng thì bỏ chọn khi đổi trang.

## 10. Text tiếng Việt là key i18n

**Quyết định**: `t('Câu tiếng Việt có dấu')`, `en.json` là bản dịch; không có `vi.json` và không có key kỹ thuật kiểu `projects.create.title`.

**Bối cảnh**: team đọc code thấy ngay text; key kỹ thuật buộc mở file khác để biết màn hình hiện gì.

**Hệ quả**: test đối chiếu bắt key thiếu bản dịch. Đổi câu tiếng Việt là đổi key, phải sửa `en.json` cùng lúc.

## 11. Token một nguồn, hai nơi khai

**Quyết định**: `src/app/tokens.ts` là nguồn; `theme.ts` map sang Ant Design; `styles.css` khai lại ở `:root`. Test đối chiếu giữ hai nơi khớp.

**Bối cảnh**: Ant Design scope biến CSS vào class hash nên Tailwind không đọc được; cần biến `:root` riêng, và cần ngay lúc parse CSS để không nháy màu.

## 12. Không `useMemo`/`useCallback` tay

**Quyết định**: bật React Compiler; rule `react-hooks/*` bản compiler chặn memo tay sai dependency và các mẫu effect sai.

**Hệ quả**: code ngắn hơn; lỗi "stale closure" giảm. Cần React 19 và giữ component thuần (không mutate trong render).

## 13. pnpm với chính sách release-age 24 giờ

**Quyết định**: pnpm 12, `minimumReleaseAge` 24 giờ, `allowBuilds` chỉ cho package cần build script.

**Bối cảnh**: các vụ supply-chain gần đây đều bị phát hiện trong vài giờ sau publish.

**Hệ quả**: package vừa ra phải chờ, hoặc thêm vào exclude kèm lý do trong PR. Dockerfile phải copy `pnpm-workspace.yaml` và `.npmrc` trước khi install.

## 14. Monitoring là điểm cắm, không kéo SDK

**Quyết định**: `lib/monitoring.ts` và `lib/analytics.ts` định nghĩa contract; `src/app/monitoring.ts` là nơi dự án thật gắn Sentry, PostHog. Base không cài SDK.

**Bối cảnh**: giữ bundle nhẹ và không ép dự án chọn nhà cung cấp.

**Hệ quả**: lỗi query, route, window và `X-Request-Id` đã đi qua contract; gắn SDK là một hàm `use(...)`.

## 15. Ngân sách bundle là con số cứng

**Quyết định**: `scripts/check-bundle-size.mjs` fail CI khi framework chunk quá 180 KB, entry quá 40 KB, chunk lẻ quá 250 KB, CSS quá 30 KB, tổng JS quá 750 KB (gzip).

**Bối cảnh**: gộp cả Ant Design vào một chunk từng tạo chunk 1.1 MB; không có con số thì không ai nhận ra.

**Hệ quả**: nâng ngân sách là thay đổi có label `guards` và lý do.

## 16. Mỗi route một chunk, kiểm bằng manifest

**Quyết định**: bật `autoCodeSplitting` của TanStack Router thay vì viết file `.lazy.tsx` tay; `pnpm size` đọc `dist/.vite/manifest.json` và fail nếu route nào không phải dynamic entry. Bản dịch tải động theo ngôn ngữ, không nằm trong chunk đầu.

**Bối cảnh**: 100 màn hình mà route import page thẳng thì chunk đầu lớn theo số feature. Tách tay bằng `.lazy.tsx` phụ thuộc vào người nhớ; tách tự động thì `pnpm gen` và mọi route sau đều được hưởng.

**Hệ quả**: `vite.config.ts` là file guard (label `guards`). Ngân sách entry hạ xuống 40 KB để page hay file dịch lọt vào chunk đầu là đỏ.

## Chưa quyết định

- Form nhiều bước (wizard): chưa có lỗi thật để chốt hành vi, nên chưa có adapter. Khi cần, làm cùng lúc adapter, test và dòng pitfalls.
- Realtime (WebSocket, SSE): chưa có nhu cầu trong base; khi có, đặt subscription ở `core/` với cleanup và reconnect có test.
