# Agent Instructions

Áp dụng cho mọi AI agent (Cursor, Codex, Copilot, Claude Code). Nội dung chuẩn nằm ở [CLAUDE.md](./CLAUDE.md) và [SKILLS.md](./SKILLS.md); đọc hai file đó trước khi sửa `src/`.

Tóm tắt:

1. Feature-first, mẫu chuẩn `src/features/projects`.
2. Chiều phụ thuộc `routes → features → components → lib`, ESLint enforce.
3. File kebab-case, không cross-feature import (trừ `features/auth`).
4. API qua `features/<x>/api.ts` + TanStack Query, kèm MSW handler.
5. Kết thúc task bằng `yarn validate && yarn test && yarn build`.
