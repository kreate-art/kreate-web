import * as Dialog from "@radix-ui/react-dialog";
import cx from "classnames";
import * as React from "react";

import Divider from "../../../Divider";
import Title from "../../../Title";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
};

export default function Header({ className, style, content, children }: Props) {
  const actualChildren = children || content;
  return (
    <Dialog.Title asChild>
      <div className={cx(styles.container, className)} style={style}>
        <Title className={styles.title} size="h4" content={actualChildren} />
        <Divider.Horizontal />
      </div>
    </Dialog.Title>
  );
}
