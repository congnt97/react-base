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
   * If it returns a Promise, the form locks its fields until done and ignores a
   * duplicate submit. `ApiError.fieldErrors` gets attached to the right field; any
   * other `ApiError` has already been toasted in the mutation hook so it isn't
   * rethrown. A non-`ApiError` is rethrown for monitoring to catch.
   */
  onSubmit: (values: TValues) => unknown;
  /** Submitting from outside (e.g. `mutation.isPending`); locks fields the same way. */
  submitting?: boolean;
};

/**
 * Form wrapper: blocks duplicate submit, locks fields while submitting, shows field
 * errors from the backend. Features must use this instead of AntD's Form.
 */
export function Form<TValues extends object>({
  onSubmit,
  submitting = false,
  form,
  ...props
}: FormProps<TValues>) {
  const [instance] = AntForm.useForm<TValues>(form);
  // Field names from the backend are strings; FormInstance isn't generic over a string NamePath.
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
