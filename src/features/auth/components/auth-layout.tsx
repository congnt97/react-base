import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4 py-10">
      <section className="w-full max-w-[420px] rounded-lg border border-[var(--border-subtle)] bg-[var(--content-bg)] p-6">
        <div className="mb-6">
          <p className="m-0 text-sm font-medium text-[var(--primary)]">
            React Base
          </p>
          <h1 className="m-0 mt-2 text-2xl font-semibold text-[var(--text-main)]">
            {t('Lõi frontend CMS')}
          </h1>
        </div>
        {children}
      </section>
    </main>
  );
}
