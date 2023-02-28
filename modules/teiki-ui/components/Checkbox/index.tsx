import * as RadixCheckbox from "@radix-ui/react-checkbox";
import cx from "classnames";
import * as React from "react";

import IconTick from "./icons/IconTick";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: boolean;
  onChange?: (value: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
};

export default function Checkbox({
  className,
  style,
  value,
  onChange,
  label,
  disabled,
}: Props) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <label className={cx(styles.container, className)} style={style}>
      <div className={styles.buttonWrapper}>
        <RadixCheckbox.Root
          className={cx(
            styles.checkboxRoot,
            disabled
              ? styles.unchecked
              : value
              ? styles.checked
              : styles.unchecked
          )}
          checked={value}
          onCheckedChange={(value) => {
            onChange && onChange(value === "indeterminate" ? false : value);
          }}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {isFocused ? <div className={styles.outline} /> : null}
          <RadixCheckbox.Indicator
            className={styles.checkboxIndicator}
            style={{
              color: !value
                ? "transparent"
                : disabled
                ? "rgba(0, 54, 44, 0.5)"
                : "#FFFFFF",
            }}
          >
            <IconTick />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
      </div>
      <div className={styles.label}>{label}</div>
    </label>
  );
}
