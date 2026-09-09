import { SearchOutlined } from '@ant-design/icons';
import { Input, type InputProps } from 'antd';

export function SearchInput(props: InputProps) {
  return <Input allowClear prefix={<SearchOutlined />} {...props} />;
}
