import type { ThemeConfig } from 'antd';

// Đồng bộ với CSS variables trong src/styles/styles.css.
// Màu chữ phụ/placeholder/link chọn để đạt WCAG AA (>= 4.5:1) trên nền trắng;
// e2e/a11y.spec.ts quét axe sẽ fail nếu đổi sang màu nhạt hơn.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2563eb',
    colorLink: '#1d4ed8',
    // Bg đặt tường minh: AntD suy bg từ màu chữ tối sẽ ra màu xỉn, và cặp chữ/nền
    // này đạt >= 5:1 cho Tag/Alert.
    colorSuccess: '#166534',
    colorSuccessBg: '#dcfce7',
    colorWarning: '#92400e',
    colorWarningBg: '#fef3c7',
    colorError: '#dc2626',
    colorErrorBg: '#fee2e2',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#64748b',
    colorTextDescription: '#64748b',
    colorTextPlaceholder: '#64748b',
    colorBorder: '#e2e8f0',
    borderRadius: 8,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Card: {
      borderRadiusLG: 8,
    },
    Layout: {
      bodyBg: '#f8fafc',
      headerBg: '#ffffff',
      siderBg: '#0f172a',
    },
    // Sidebar menu: chỉnh qua token thay vì override CSS bằng !important.
    Menu: {
      darkItemBg: '#0f172a',
      darkItemColor: '#cbd5e1',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      darkItemHoverColor: '#f8fafc',
      darkItemSelectedBg: '#1d4ed8',
      darkItemSelectedColor: '#ffffff',
      itemBorderRadius: 8,
      itemHeight: 40,
      itemMarginInline: 12,
    },
  },
};
