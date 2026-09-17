import { Drawer as AntDrawer, type DrawerProps as AntDrawerProps } from 'antd';

type DrawerProps = AntDrawerProps & {
  /** While submitting: locks the mask, ESC, and close button so in-flight data isn't lost. */
  submitting?: boolean;
};

/** Drawer wrapper: locks closing while submitting, destroys content on close. Features must use this. */
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
      // AntD 6.6 deprecates maskClosable, replaced by mask.closable (keeps enabled defaulting to true).
      mask={{ closable: maskClosable && !submitting }}
      keyboard={keyboard && !submitting}
      closable={closable && !submitting}
      {...props}
    />
  );
}
