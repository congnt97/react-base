import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { useRegister } from '@/features/auth/hooks/use-register';
import type { RegisterRequest } from '@/features/auth/types';

export function RegisterForm() {
  const { t } = useTranslation();
  const register = useRegister();

  return (
    <Form<RegisterRequest>
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => register.mutate(values)}
    >
      <Form.Item
        label={t('Tên')}
        name="name"
        rules={[{ required: true, message: t('Nhập tên') }]}
      >
        <Input prefix={<UserOutlined />} placeholder={t('Tên hiển thị')} />
      </Form.Item>

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
        rules={[
          { required: true, message: t('Nhập mật khẩu') },
          { min: 6, message: t('Mật khẩu tối thiểu 6 ký tự') },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder={t('Mật khẩu')} />
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={register.isPending}
      >
        {t('Đăng ký')}
      </Button>

      <p className="mb-0 mt-4 text-center text-sm text-[var(--text-muted)]">
        {t('Đã có tài khoản?')}{' '}
        <Link
          to="/auth/login"
          search={{ redirectTo: undefined, reason: undefined }}
          className="underline!"
        >
          {t('Đăng nhập')}
        </Link>
      </p>
    </Form>
  );
}
