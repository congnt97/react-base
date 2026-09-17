import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Upload as AntUpload, type UploadProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/api-error';
import type { UploadedFile } from '@/lib/upload';

type UploadFieldProps = {
  /** MIME whitelist, e.g. ['application/pdf', 'image/png']. */
  accept: string[];
  maxSizeMb: number;
  upload: (file: File) => Promise<UploadedFile>;
  /** URL of the uploaded file; AntD's Form injects value/onChange when placed in a Form.Item. */
  value?: string;
  onChange?: (url?: string) => void;
  disabled?: boolean;
};

const fileNameFromUrl = (url: string) => url.split('/').pop() ?? url;

/**
 * Upload wrapper: validates type/size on the client (UX only), one file at a time, the
 * button shows loading while uploading. The backend must still validate. The value is a
 * URL string so it can go straight into the form payload. Features must use this instead
 * of AntD's Upload.
 */
export function Upload({
  accept,
  maxSizeMb,
  upload,
  value,
  onChange,
  disabled,
}: UploadFieldProps) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!accept.includes(file.type)) {
      message.error(t('Định dạng file không được hỗ trợ'));
      return AntUpload.LIST_IGNORE;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      message.error(t('File vượt quá {{size}} MB', { size: maxSizeMb }));
      return AntUpload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async (
    options: Parameters<NonNullable<UploadProps['customRequest']>>[0],
  ) => {
    setUploading(true);
    try {
      const uploaded = await upload(options.file as File);
      onChange?.(uploaded.url);
      options.onSuccess?.(uploaded);
    } catch (error) {
      message.error(t(getErrorMessage(error)));
      options.onError?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    } finally {
      setUploading(false);
    }
  };

  // AntD expects customRequest to return void; the error is already handled in handleUpload.
  const customRequest: UploadProps['customRequest'] = (options) => {
    void handleUpload(options);
  };

  return (
    <AntUpload
      accept={accept.join(',')}
      maxCount={1}
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onRemove={() => onChange?.(undefined)}
      fileList={
        value
          ? [
              {
                uid: value,
                name: fileNameFromUrl(value),
                status: 'done',
                url: value,
              },
            ]
          : []
      }
    >
      {value ? null : (
        <Button icon={<UploadOutlined />} loading={uploading}>
          {t('Tải file lên')}
        </Button>
      )}
    </AntUpload>
  );
}
