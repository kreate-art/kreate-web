import * as Tabs$Radix from "@radix-ui/react-tabs";
import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

function Root<T extends string>({
  className,
  style,
  value,
  options,
  onChange,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  value: T;
  options: { value: T; label: string }[];
  onChange?: (value: T) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Tabs$Radix.Root
        value={value}
        onValueChange={(value) => {
          const selectedOption = options.find((item) => item.value == value);
          selectedOption != null && onChange && onChange(selectedOption.value);
        }}
      >
        <Flex.Col gap="48px">
          <Tabs$Radix.List className={styles.list}>
            {options.map((item, index) => (
              <Tabs$Radix.Trigger
                className={styles.trigger}
                value={item.value}
                key={index}
              >
                {item.label}
              </Tabs$Radix.Trigger>
            ))}
          </Tabs$Radix.List>
          <Flex.Cell>{children}</Flex.Cell>
        </Flex.Col>
      </Tabs$Radix.Root>
    </div>
  );
}

function Page({
  value,
  children,
}: {
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <Tabs$Radix.Content className={styles.content} value={value} forceMount>
      {children}
    </Tabs$Radix.Content>
  );
}

const PageControl = Object.assign(Root, { Page });

export default PageControl;
