import { SearchOutlined } from '@ant-design/icons';
import { Input, type InputProps } from 'antd';

import { useDebouncedCallback } from '@/components/hooks/use-debounced-callback';

type SearchInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  defaultValue?: string;
  /** Gọi sau khi ngừng gõ `delay` ms, khi bấm Enter, hoặc khi xoá trắng. */
  onSearch: (keyword: string | undefined) => void;
  delay?: number;
};

/**
 * Ô tìm kiếm tự tìm sau khi ngừng gõ. Người dùng không phải biết là phải bấm Enter;
 * Enter vẫn tìm ngay cho ai quen thao tác bàn phím.
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
