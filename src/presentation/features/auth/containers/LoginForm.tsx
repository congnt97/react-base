import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button, Form, Input } from 'antd';

import type { LoginRequest } from '@/domain/models/Auth';
import { useLogin } from '@/presentation/hooks/auth/useLogin';

export function LoginForm() {
  const login = useLogin();

  return (
    <Form<LoginRequest>
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => login.mutate(values)}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="you@example.com" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: 'Nhập mật khẩu' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={login.isPending}
      >
        Đăng nhập
      </Button>

      <p className="mb-0 mt-4 text-center text-sm text-[var(--text-muted)]">
        Chưa có tài khoản? <Link to="/auth/register">Đăng ký</Link>
      </p>
    </Form>
  );
}
