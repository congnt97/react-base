import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { useLogin } from '@/features/auth/hooks/use-login';
import type { LoginRequest } from '@/features/auth/types';

export function LoginForm() {
  const { t } = useTranslation();
  const login = useLogin();

  return (
    <Form<LoginRequest>
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => login.mutate(values)}
    >
      <Form.Item
        label={t('Email')}
        name="email"
        rules={[
          { required: true, message: t('Nhập email') },
          { type: 'email', message: t('Email không hợp lệ') },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        label={t('Mật khẩu')}
        name="password"
        rules={[{ required: true, message: t('Nhập mật khẩu') }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder={t('Mật khẩu')} />
      </Form.Item>

      <Button block type="primary" htmlType="submit" loading={login.isPending}>
        {t('Đăng nhập')}
      </Button>

      <p className="mb-0 mt-4 text-center text-sm text-[var(--text-muted)]">
        {t('Chưa có tài khoản?')}{' '}
        {/* underline! vì .ant-app a đặt text-decoration none; link trong đoạn văn phải có gạch chân (a11y). */}
        <Link to="/auth/register" className="underline!">
          {t('Đăng ký')}
        </Link>
      </p>
    </Form>
  );
}
