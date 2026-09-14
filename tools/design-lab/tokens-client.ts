import { cssVariableName, type DesignTokens } from '@/app/tokens';

const ENDPOINT = '/__design-tokens';

/**
 * `Object.entries` làm mất kiểu của khoá. Một chỗ ép kiểu duy nhất ở đây để phần
 * còn lại của Design Lab không phải ép, và chỉ dùng cho object token đọc từ file.
 */
export const entries = <TObject extends object>(value: TObject) =>
  Object.entries(value) as [keyof TObject & string, TObject[keyof TObject]][];

export const fetchTokens = async (): Promise<DesignTokens> => {
  const response = await fetch(ENDPOINT);
  if (!response.ok) {
    throw new Error('Không đọc được design-tokens.json');
  }
  return response.json() as Promise<DesignTokens>;
};

export const saveTokens = async (tokens: DesignTokens) => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens),
  });
  const body = (await response.json()) as { message: string };
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body.message;
};

/** Biến CSS cho bản đang sửa, đặt ở :root nên cả portal của AntD cũng ăn theo. */
export const previewCss = (tokens: DesignTokens) =>
  `:root {\n${entries(tokens.colors)
    .map(([token, value]) => `  ${cssVariableName(token)}: ${value};`)
    .join('\n')}\n}`;
