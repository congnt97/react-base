import { Collapse, ColorPicker, InputNumber, Input, Typography } from 'antd';

import type { DesignTokens } from '@/app/tokens';

import { entries } from './tokens-client';

type TokenPanelProps = {
  tokens: DesignTokens;
  onChange: (tokens: DesignTokens) => void;
};

const GROUP_LABELS: Record<string, string> = {
  colors: 'Màu',
  layout: 'Bố cục',
  typography: 'Chữ',
  button: 'Button',
  input: 'Input và Select',
  card: 'Card',
  modal: 'Modal',
  table: 'Bảng',
};

type Group = { key: string; values: Record<string, string | number> };

const groupsOf = (tokens: DesignTokens): Group[] => [
  { key: 'colors', values: tokens.colors },
  { key: 'layout', values: tokens.layout },
  { key: 'typography', values: tokens.typography },
  ...entries(tokens.components).map(([key, values]) => ({ key, values })),
];

function Field({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  const control = () => {
    if (typeof value === 'number') {
      return (
        <InputNumber
          size="small"
          min={1}
          value={value}
          onChange={(next) => onChange(next ?? value)}
          className="w-28"
        />
      );
    }
    if (value.startsWith('#')) {
      return (
        <ColorPicker
          size="small"
          value={value}
          onChange={(color) => onChange(color.toHexString())}
          showText
        />
      );
    }
    return (
      <Input
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-56"
      />
    );
  };

  return (
    <label className="mb-3 flex items-center justify-between gap-3 text-sm">
      <span className="text-[var(--text-muted)]">{name}</span>
      {control()}
    </label>
  );
}

export function TokenPanel({ tokens, onChange }: TokenPanelProps) {
  const update = (group: string, name: string, value: string | number) => {
    if (group === 'colors' || group === 'layout' || group === 'typography') {
      onChange({ ...tokens, [group]: { ...tokens[group], [name]: value } });
      return;
    }
    onChange({
      ...tokens,
      components: {
        ...tokens.components,
        [group]: {
          ...tokens.components[group as keyof DesignTokens['components']],
          [name]: value,
        },
      },
    });
  };

  return (
    <Collapse
      size="small"
      defaultActiveKey={['colors', 'button', 'input']}
      items={groupsOf(tokens).map(({ key, values }) => ({
        key,
        label: (
          <Typography.Text strong>{GROUP_LABELS[key] ?? key}</Typography.Text>
        ),
        children: entries(values).map(([name, value]) => (
          <Field
            key={name}
            name={name}
            value={value}
            onChange={(next) => update(key, name, next)}
          />
        )),
      }))}
    />
  );
}
