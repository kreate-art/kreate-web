import * as Dialog from "@radix-ui/react-dialog";
import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

const SIZE_TO_CLASS_NAME = {
  medium: styles.sizeMedium,
  small: styles.sizeSmall,
};

// We use the interface from:
// https://react.semantic-ui.com/modules/modal/
type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  open: boolean;
  /** @deprecated use onClose instead */
  onOpenChange?: (newOpen: boolean) => void;
  onClose?: () => void;
  size?: keyof typeof SIZE_TO_CLASS_NAME;
  closeOnEscape?: boolean;
  closeOnDimmerClick?: boolean;
};

export default function Container({
  className,
  style,
  children,
  open,
  onOpenChange,
  onClose,
  size = "medium",
  closeOnEscape = true,
  closeOnDimmerClick = true,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        !open && onClose && onClose();
        onOpenChange && onOpenChange(open);
      }}
    >
      <Dialog.Portal className={styles.portal}>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={cx(className, styles.content, SIZE_TO_CLASS_NAME[size])}
          style={style}
          onEscapeKeyDown={
            closeOnEscape ? undefined : (e) => e.preventDefault()
          }
          onPointerDownOutside={
            closeOnDimmerClick ? undefined : (e) => e.preventDefault()
          }
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
