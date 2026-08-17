import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4 py-10">
      <section className="w-full max-w-[420px] rounded-lg border border-[var(--border-subtle)] bg-white p-6">
        <div className="mb-6">
          <p className="m-0 text-sm font-medium text-[var(--primary)]">
            React Base
          </p>
          <h1 className="m-0 mt-2 text-2xl font-semibold text-[var(--text-main)]">
            Lõi frontend CMS
          </h1>
        </div>
        {children}
      </section>
    </main>
  );
}
