import { SearchOutlined } from '@ant-design/icons';
import { Input, type InputProps } from 'antd';

import { useDebouncedCallback } from '@/core/hooks/use-debounced-callback';

type SearchInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  defaultValue?: string;
  /** Called after typing stops for `delay` ms, on Enter, or when cleared. */
  onSearch: (keyword: string | undefined) => void;
  delay?: number;
};

/**
 * Search input that searches on its own once typing stops. The user doesn't need to know
 * to press Enter; Enter still searches immediately for keyboard-driven users.
 */
export function SearchInput({
  defaultValue,
  onSearch,
  delay = 400,
  ...props
}: SearchInputProps) {
  const normalize = (value: string) => value.trim() || undefined;
  const debouncedSearch = useDebouncedCallback(onSearch, delay);

  return (
    <Input
      allowClear
      prefix={<SearchOutlined />}
      defaultValue={defaultValue}
      onChange={(event) => debouncedSearch(normalize(event.target.value))}
      onPressEnter={(event) => onSearch(normalize(event.currentTarget.value))}
      {...props}
    />
  );
}
