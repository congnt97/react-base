import {
  App,
  Button as AntButton,
  ConfigProvider,
  Space,
  Spin,
  Typography,
} from 'antd';
import viVN from 'antd/locale/vi_VN';
import { useEffect, useState } from 'react';

import { buildAntdTheme } from '@/app/theme';
import type { DesignTokens } from '@/app/tokens';

import { Gallery } from './gallery';
import { TokenPanel } from './token-panel';
import { fetchTokens, previewCss, saveTokens } from './tokens-client';

function Workbench({ initial }: { initial: DesignTokens }) {
  const { message } = App.useApp();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    try {
      const note = await saveTokens(draft);
      setSaved(draft);
      void message.success(note);
    } catch (error) {
      void message.error(
        error instanceof Error ? error.message : 'Lưu thất bại',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ConfigProvider theme={buildAntdTheme(draft)} locale={viVN}>
      <style>{previewCss(draft)}</style>
      <App>
        <div className="flex min-h-screen">
          <aside className="w-[340px] shrink-0 overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--content-bg)] p-4">
            <Typography.Title level={5}>Design Lab</Typography.Title>
            <Typography.Paragraph type="secondary" className="text-xs">
              Sửa token rồi bấm Lưu: ghi vào src/app/design-tokens.json và sinh
              lại biến CSS. Mọi component trong dự án ăn theo ngay.
            </Typography.Paragraph>

            <Space className="mb-4">
              <AntButton
                type="primary"
                loading={saving}
                disabled={!dirty}
                onClick={() => void save()}
              >
                Lưu vào source
              </AntButton>
              <AntButton disabled={!dirty} onClick={() => setDraft(saved)}>
                Hoàn tác
              </AntButton>
            </Space>

            <TokenPanel tokens={draft} onChange={setDraft} />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--app-bg)] p-6">
            <Gallery />
          </main>
        </div>
      </App>
    </ConfigProvider>
  );
}

export function DesignLab() {
  const [tokens, setTokens] = useState<DesignTokens | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Đọc từ server để luôn khớp file trên đĩa, kể cả khi vừa sửa tay JSON.
  useEffect(() => {
    fetchTokens().then(setTokens, (reason: unknown) =>
      setError(
        reason instanceof Error ? reason.message : 'Không đọc được token',
      ),
    );
  }, []);

  if (error) {
    return <div className="p-6">{error}</div>;
  }
  if (!tokens) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  return <Workbench initial={tokens} />;
}
