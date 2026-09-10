import {
  Form as AntForm,
  type FormInstance,
  type FormProps as AntFormProps,
} from 'antd';
import type { ReactNode } from 'react';

import { useAsyncAction } from '@/core/hooks/use-async-action';
import { ApiError } from '@/lib/api-error';

type FormProps<TValues> = Omit<
  AntFormProps<TValues>,
  'onFinish' | 'disabled' | 'children'
> & {
  children?: ReactNode;
  /**
   * Trả Promise thì form khoá field tới khi xong và bỏ qua submit trùng.
   * `ApiError.fieldErrors` được gắn vào đúng field; lỗi ApiError khác đã được
   * toast ở hook mutation nên không ném tiếp. Lỗi không phải ApiError ném ra
   * để monitoring bắt.
   */
  onSubmit: (values: TValues) => unknown;
  /** Đang gửi từ bên ngoài (vd mutation.isPending); khoá field như trên. */
  submitting?: boolean;
};

/**
 * Bản bọc Form: chặn submit trùng, khoá field khi đang gửi, hiện lỗi field từ
 * backend. Feature phải dùng bản này thay vì antd Form.
 */
export function Form<TValues extends object>({
  onSubmit,
  submitting = false,
  form,
  ...props
}: FormProps<TValues>) {
  const [instance] = AntForm.useForm<TValues>(form);
  // Tên field từ backend là chuỗi; FormInstance không generic nhận NamePath chuỗi.
  const fields: FormInstance = instance;
  const action = useAsyncAction(async (values: TValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        throw error;
      }
      if (error.fieldErrors) {
        fields.setFields(
          Object.entries(error.fieldErrors).map(([name, message]) => ({
            name,
            errors: [message],
          })),
        );
      }
    }
  });

  return (
    <AntForm
      form={instance}
      disabled={submitting || action.pending}
      onFinish={(values) => void action.run(values)}
      {...props}
    />
  );
}

Form.Item = AntForm.Item;
Form.List = AntForm.List;
Form.useForm = AntForm.useForm;
Form.useWatch = AntForm.useWatch;
