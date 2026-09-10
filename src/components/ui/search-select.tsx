import { Select, Spin, type SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAsyncOptions } from '@/core/hooks/use-async-options';

export type SelectOption = { value: string; label: string };

type SearchSelectProps = Omit<
  SelectProps<string, SelectOption>,
  | 'options'
  | 'onSearch'
  | 'filterOption'
  | 'showSearch'
  | 'loading'
  | 'notFoundContent'
  | 'onChange'
> & {
  /** Gọi server; nhận `signal` để huỷ khi người dùng gõ tiếp. */
  search: (keyword: string, signal: AbortSignal) => Promise<SelectOption[]>;
  /** Option của giá trị đang chọn (khi sửa), để hiện label trước khi tìm. */
  selectedOption?: SelectOption;
  onChange?: (value: string | undefined, option?: SelectOption) => void;
  minLength?: number;
};

/**
 * Select tìm từ server: debounce, huỷ request cũ, bỏ response cũ về sau.
 * Feature dùng bản này cho mọi select có dữ liệu từ API; select tĩnh dùng antd Select.
 */
export function SearchSelect({
  search,
  selectedOption,
  onChange,
  minLength = 1,
  placeholder,
  ...props
}: SearchSelectProps) {
  const { t } = useTranslation();
  const result = useAsyncOptions(search, { minLength });

  // Giữ option đang chọn trong danh sách để Select luôn hiện được label.
  const options =
    selectedOption &&
    !result.options.some((option) => option.value === selectedOption.value)
      ? [selectedOption, ...result.options]
      : result.options;

  return (
    <Select<string, SelectOption>
      showSearch
      allowClear
      filterOption={false}
      options={options}
      loading={result.loading}
      placeholder={placeholder ?? t('Gõ để tìm')}
      notFoundContent={
        result.loading ? <Spin size="small" /> : t('Không có kết quả')
      }
      onSearch={result.onSearch}
      onChange={(value, option) =>
        onChange?.(value, Array.isArray(option) ? option[0] : option)
      }
      {...props}
    />
  );
}
