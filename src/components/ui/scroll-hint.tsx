import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Bọc nội dung cuộn ngang (bảng nhiều cột trên màn hẹp) và báo cho người dùng biết
 * còn nội dung bên phải. Không có dấu hiệu này, user tưởng bảng chỉ có vài cột.
 *
 * Đo phần tử cuộn thật của AntD Table thay vì wrapper, vì Table tự tạo khung cuộn.
 */
export function ScrollHint({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scroller =
      container?.querySelector<HTMLElement>(
        '.ant-table-content, .ant-table-body',
      ) ?? container;
    if (!scroller) {
      return;
    }

    const update = () => {
      const remaining =
        scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
      setHasMore(remaining > 8);
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);

    return () => {
      scroller.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
      {hasMore ? (
        <>
          <div className="scroll-hint-fade" aria-hidden="true" />
          <p className="m-0 mt-2 text-center text-xs text-[var(--text-muted)] lg:hidden">
            {t('Vuốt ngang để xem thêm cột')}
          </p>
        </>
      ) : null}
    </div>
  );
}
