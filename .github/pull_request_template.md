## Thay đổi

<!-- Mô tả ngắn: làm gì, vì sao. Link ticket nếu có. -->

## Checklist

- [ ] Đã đọc `SKILLS.md` và rule phụ liên quan
- [ ] Feature đi đúng flow `types -> endpoints -> api -> hooks -> components -> pages -> routes`, có MSW handler
- [ ] UI text qua `t()`, có bản dịch trong `locales/en.json` nếu cần
- [ ] Permission mới thêm vào `PERMISSIONS` + `ROLE_PERMISSIONS` + test
- [ ] `pnpm validate`, `pnpm test`, `pnpm build` pass; E2E cập nhật nếu đổi luồng chính
- [ ] Sửa bug thật: đã thêm guard (test hành vi/lint) và dòng trong `docs/skills/pitfalls.md`
- [ ] Sửa file guard (`eslint.config.js`, `vitest.config.ts`, `scripts/`, `.github/`): đã gắn label `guards` và ghi lý do
- [ ] Screenshot/GIF cho thay đổi UI
