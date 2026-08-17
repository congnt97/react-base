import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button, Form, Input } from 'antd';

import type { RegisterRequest } from '@/domain/models/Auth';
import { useRegister } from '@/presentation/hooks/auth/useRegister';

export function RegisterForm() {
  const register = useRegister();

  return (
    <Form<RegisterRequest>
      layout="vertical"
      requiredMark={false}
      onFinish={(values) => register.mutate(values)}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: 'Nhập tên' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên hiển thị" />
      </Form.Item>

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
        rules={[
          { required: true, message: 'Nhập mật khẩu' },
          { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Button
        block
        type="primary"
        htmlType="submit"
        loading={register.isPending}
      >
        Đăng ký
      </Button>

      <p className="mb-0 mt-4 text-center text-sm text-[var(--text-muted)]">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" search={{ redirectTo: undefined }}>
          Đăng nhập
        </Link>
      </p>
    </Form>
  );
}
