import { Link } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';
import type { ReactNode } from 'react';

type BreadcrumbItem = {
  label: string;
  /** Có `to` thì là link, không thì là mục hiện tại. */
  to?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {breadcrumbs?.length ? (
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            title: item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              item.label
            ),
          }))}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="m-0 text-2xl font-semibold text-[var(--text-main)]">
            {title}
          </h1>
          {description ? (
            <p className="m-0 mt-1 text-sm text-[var(--text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
