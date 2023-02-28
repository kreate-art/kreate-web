import * as Dialog from "@radix-ui/react-dialog";
import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
};

// https://www.radix-ui.com/docs/primitives/components/dialog#description
export default function Description({
  className,
  style,
  content,
  children,
}: Props) {
  const actualChildren = children || content;
  return (
    <Dialog.Description
      className={cx(className, styles.container)}
      style={style}
    >
      {actualChildren}
    </Dialog.Description>
  );
}
