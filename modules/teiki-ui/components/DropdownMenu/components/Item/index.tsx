import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  content?: React.ReactNode;
  children?: React.ReactNode;
  onSelect?: () => void;
};

export default function Item({ content, children = content, onSelect }: Props) {
  return (
    <DropdownMenu.Item className={styles.container} onSelect={onSelect}>
      {children}
    </DropdownMenu.Item>
  );
}
