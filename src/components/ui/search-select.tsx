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
  /** Calls the server; receives `signal` to cancel when the user keeps typing. */
  search: (keyword: string, signal: AbortSignal) => Promise<SelectOption[]>;
  /** Option for the currently selected value (when editing), to show the label before searching. */
  selectedOption?: SelectOption;
  onChange?: (value: string | undefined, option?: SelectOption) => void;
  minLength?: number;
};

/**
 * Select that searches the server: debounces, cancels the previous request, discards a
 * stale response that arrives late. Features use this for any select backed by API data;
 * a static select uses AntD's Select directly.
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

  // Keep the currently selected option in the list so Select can always show its label.
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
