import { Button, Empty } from 'antd';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Nút hành động chính, ví dụ "Tạo dự án". */
  action?: { label: string; onClick: () => void; icon?: ReactNode };
};

// Empty state có hướng dẫn hành động; "Trống" mặc định của AntD không nói user nên làm gì.
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[var(--text-main)]">{title}</span>
          {description ? (
            <span className="text-sm text-[var(--text-muted)]">
              {description}
            </span>
          ) : null}
        </div>
      }
    >
      {action ? (
        <Button type="primary" icon={action.icon} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </Empty>
  );
}
