# Security Rules

Đọc file này khi task có auth, token, permission, role, upload, file preview, secret, logging, XSS, AI/user/API output, hoặc data nhạy cảm.

Rule gốc:

```text
Frontend security is guardrail, not authority.
Backend must enforce auth, permission, file validation, and data access.
```

## Token And Auth

- Không log token, refresh token, password, API key, full auth response.
- Không lưu token làm source of truth trong Zustand.
- Token source of truth là `src/shared/auth-storage.ts` hoặc httpOnly cookie nếu backend hỗ trợ.
- Zustand chỉ giữ UI auth state: `user`, `isAuthenticated`, `isLoading`.
- HttpClient đọc token từ storage/cookie, component không đọc token trực tiếp.
- Logout phải clear auth storage, Zustand, và query cache liên quan.
- Protected route phải nằm dưới `src/routes/_app`.

## Env And Secrets

- Không hardcode API key, secret, token trong frontend.
- `VITE_*` env là public, không đặt secret thật trong đó.
- Env phải required và fail fast.
- Không in env nhạy cảm ra console.

## API Security

- Không trust frontend validation; backend phải validate lại.
- Không expose raw backend error quá chi tiết lên UI.
- Không swallow error im lặng; hiện message an toàn, log có kiểm soát nếu cần.
- Không hardcode endpoint string rải rác; dùng `src/shared/endpoints.ts`.
- Không gửi data nhạy cảm nếu prompt/task không yêu cầu rõ.
- Không dùng fallback demo để che data required bị thiếu trong production.

## XSS And Untrusted Content

- Coi text từ user, API, AI output, subtitle, script, metadata asset là untrusted.
- Không dùng `dangerouslySetInnerHTML` trừ khi thật sự cần.
- Nếu bắt buộc render HTML, phải sanitize bằng utility/library được chấp thuận.
- Không render HTML từ AI/API trực tiếp trong component.
- Không inject string vào URL, style, iframe, script nếu chưa validate.

## Upload, Asset, Video, Subtitle

- Frontend validate file type/size để UX tốt, nhưng backend vẫn phải validate lại.
- Upload phải whitelist MIME/extension.
- Không tin metadata file từ client.
- Không preview file là HTML/SVG/script không kiểm soát.
- Subtitle/script upload phải coi là text untrusted, không render HTML.
- Asset URL từ API phải được encode/validate trước khi dùng trong preview/download.

## Permission And Role

- Hide button trên UI không thay thế backend authorization.
- Role guard frontend chỉ là UX guard; backend phải enforce.
- Nếu thêm role guard, tạo helper chung trong `src/shared/route-guards.ts`.
- Không duplicate permission logic rải rác trong component.

## Logging

- Không commit console log chứa data nhạy cảm.
- Không log password, token, refresh token, API key, authorization header.
- Không log full request/response nếu có user data hoặc auth data.
- Debug log tạm thời phải gỡ bỏ trước khi kết thúc task.

## Dependencies

- Không thêm package security-sensitive nếu package hiện có đáp ứng.
- Nếu thêm package cho HTML sanitize, upload, auth, crypto, permission, phải có lý do rõ.
- Ưu tiên package phổ biến, maintained, và typed tốt.
