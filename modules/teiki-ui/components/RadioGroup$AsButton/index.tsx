import * as RadioGroup from "@radix-ui/react-radio-group";
import cx from "classnames";
import React from "react";

import styles from "./index.module.scss";

export type Option<T extends string> = {
  value: T;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type Props<T extends string> = {
  options: Option<T>[];
  value?: T;
  onChange?: (value: T) => void;
  size?: keyof typeof SIZE_TO_CLASS_NAME;
  color?: keyof typeof COLOR_TO_CLASS_NAME;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const SIZE_TO_CLASS_NAME = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
};

const COLOR_TO_CLASS_NAME = {
  primary: styles.colorPrimary,
  secondary: styles.colorSecondary,
};

export default function RadioGroup$AsButton<T extends string>({
  options,
  value,
  disabled,
  onChange,
  color = "primary",
  size = "medium",
  className,
  style,
}: Props<T>) {
  return (
    <RadioGroup.Root
      className={cx([
        styles.container,
        SIZE_TO_CLASS_NAME[size],
        COLOR_TO_CLASS_NAME[color],
        className,
      ])}
      onValueChange={onChange}
      value={value}
      disabled={disabled}
      style={style}
    >
      {options.map((item) => (
        <RadioGroup.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={styles.button}
          onClick={() => {
            const isActive = value === item.value;
            if (isActive && onChange) onChange(item.value);
          }}
        >
          <span className={styles.content}>
            {item.label}
            {item.icon}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
