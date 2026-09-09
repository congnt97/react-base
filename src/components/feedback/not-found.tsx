import { Link } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title={t('Không tìm thấy trang')}
      subTitle={t('Đường dẫn bạn truy cập không tồn tại.')}
      extra={
        <Link to="/">
          <Button type="primary">{t('Về dashboard')}</Button>
        </Link>
      }
    />
  );
}
