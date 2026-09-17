import type { ThemeConfig } from 'antd';

import { designTokens, type DesignTokens } from '@/app/tokens';

// Tokens live in app/design-tokens.json (the single source); this file only maps them
// to AntD's names.
const buildAntdTheme = (tokens: DesignTokens): ThemeConfig => {
  const { colors, layout, typography, components } = tokens;

  return {
    token: {
      colorPrimary: colors.primary,
      colorLink: colors.link,
      colorSuccess: colors.success,
      colorSuccessBg: colors.successBg,
      colorWarning: colors.warning,
      colorWarningBg: colors.warningBg,
      colorError: colors.danger,
      colorErrorBg: colors.dangerBg,
      colorText: colors.textMain,
      colorTextSecondary: colors.textMuted,
      colorTextTertiary: colors.textMuted,
      colorTextDescription: colors.textMuted,
      colorTextPlaceholder: colors.textMuted,
      colorBorder: colors.borderSubtle,
      borderRadius: layout.borderRadius,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
    },
    components: {
      Button: {
        borderRadius: components.button.borderRadius,
        controlHeight: components.button.controlHeight,
        paddingInline: components.button.paddingInline,
        fontWeight: components.button.fontWeight,
      },
      Input: {
        borderRadius: components.input.borderRadius,
        controlHeight: components.input.controlHeight,
        paddingInline: components.input.paddingInline,
      },
      Select: {
        borderRadius: components.input.borderRadius,
        controlHeight: components.input.controlHeight,
      },
      Card: {
        borderRadiusLG: components.card.borderRadius,
      },
      Modal: {
        borderRadiusLG: components.modal.borderRadius,
      },
      Table: {
        headerBg: components.table.headerBg,
        rowHoverBg: components.table.rowHoverBg,
        cellPaddingBlock: components.table.cellPaddingBlock,
      },
      Layout: {
        bodyBg: colors.appBg,
        headerBg: colors.contentBg,
        siderBg: colors.sidebarBg,
      },
      // Sidebar menu: adjusted via tokens instead of overriding CSS with !important.
      Menu: {
        darkItemBg: colors.sidebarBg,
        darkItemColor: colors.borderStrong,
        darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
        darkItemHoverColor: colors.appBg,
        darkItemSelectedBg: colors.link,
        darkItemSelectedColor: colors.contentBg,
        itemBorderRadius: layout.borderRadius,
        itemHeight: 40,
        itemMarginInline: 12,
      },
    },
  };
};

export const antdTheme = buildAntdTheme(designTokens);
