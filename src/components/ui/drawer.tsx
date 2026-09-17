import { Drawer as AntDrawer, type DrawerProps as AntDrawerProps } from 'antd';

type DrawerProps = AntDrawerProps & {
  /** Đang gửi: khoá mask, ESC và nút đóng để không mất dữ liệu đang lưu. */
  submitting?: boolean;
};

/** Bản bọc Drawer: khoá đóng khi đang gửi, huỷ nội dung khi đóng. Feature phải dùng bản này. */
export function Drawer({
  submitting = false,
  maskClosable = true,
  keyboard = true,
  closable = true,
  ...props
}: DrawerProps) {
  return (
    <AntDrawer
      destroyOnHidden
      // AntD 6.6 deprecate maskClosable, thay bằng mask.closable (giữ enabled mặc định true).
      mask={{ closable: maskClosable && !submitting }}
      keyboard={keyboard && !submitting}
      closable={closable && !submitting}
      {...props}
    />
  );
}
