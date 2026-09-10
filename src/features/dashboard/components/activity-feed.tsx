import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';
import { QueryBoundary } from '@/components/feedback/query-boundary';
import { Button } from '@/components/ui/button';
import { useActivity } from '@/features/dashboard/hooks/use-activity';
import type { Activity } from '@/features/dashboard/types';
import { formatRelativeTime } from '@/lib/format';

function ActivityList({ items }: { items: Activity[] }) {
  const { t } = useTranslation();

  return (
    <ul
      aria-label={t('Hoạt động gần đây')}
      className="m-0 list-none divide-y divide-[var(--border-subtle)] p-0"
    >
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-0.5 py-3">
          <Typography.Text>
            <Typography.Text strong>{item.actor}</Typography.Text>{' '}
            {item.message}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-xs">
            {formatRelativeTime(item.createdAt)}
          </Typography.Text>
        </li>
      ))}
    </ul>
  );
}

export function ActivityFeed() {
  const { t } = useTranslation();
  const activity = useActivity();
  const items = activity.data?.pages.flatMap((page) => page.items) ?? [];

  const renderFooter = () => {
    if (activity.hasNextPage) {
      return (
        <div className="mt-4 text-center">
          <Button onClick={() => activity.fetchNextPage()}>
            {t('Tải thêm')}
          </Button>
        </div>
      );
    }
    if (items.length > 0) {
      return (
        <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
          {t('Đã hết hoạt động')}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="app-card" title={t('Hoạt động gần đây')}>
      <QueryBoundary
        isLoading={activity.isPending && activity.isFetching}
        isError={activity.isError}
        error={activity.error}
        isEmpty={items.length === 0}
        onRetry={() => void activity.refetch()}
        emptyState={<EmptyState title={t('Chưa có hoạt động nào')} />}
      >
        <ActivityList items={items} />
      </QueryBoundary>
      {renderFooter()}
    </Card>
  );
}
