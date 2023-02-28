import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import Flex from "../../../Flex";

import styles from "./index.module.scss";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export default function Menu({ trigger, children }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={16}>
          <Flex.Col padding="8px" gap="8px">
            {children}
          </Flex.Col>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
