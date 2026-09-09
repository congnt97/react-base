import type { ThemeConfig } from 'antd';

import { colors, layout, typography } from '@/app/tokens';

// Token nằm ở app/tokens.ts (nguồn duy nhất); file này chỉ map sang tên của AntD.
export const antdTheme: ThemeConfig = {
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
  },
  components: {
    Card: {
      borderRadiusLG: layout.borderRadius,
    },
    Layout: {
      bodyBg: colors.appBg,
      headerBg: colors.contentBg,
      siderBg: colors.sidebarBg,
    },
    // Sidebar menu: chỉnh qua token thay vì override CSS bằng !important.
    Menu: {
      darkItemBg: colors.sidebarBg,
      darkItemColor: '#cbd5e1',
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
