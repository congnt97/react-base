import { Button, Card, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/feedback/error-state';
import { useActivity } from '@/features/dashboard/hooks/use-activity';

dayjs.extend(relativeTime);

export function ActivityFeed() {
  const { t } = useTranslation();
  const activity = useActivity();
  const items = activity.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Card className="app-card" title={t('Hoạt động gần đây')}>
      {activity.isError ? (
        <ErrorState error={activity.error} onRetry={() => activity.refetch()} />
      ) : activity.isPending ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
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
                {dayjs(item.createdAt).fromNow()}
              </Typography.Text>
            </li>
          ))}
        </ul>
      )}

      {activity.hasNextPage ? (
        <div className="mt-4 text-center">
          <Button
            onClick={() => activity.fetchNextPage()}
            loading={activity.isFetchingNextPage}
          >
            {t('Tải thêm')}
          </Button>
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
          {t('Đã hết hoạt động')}
        </div>
      ) : null}
    </Card>
  );
}
