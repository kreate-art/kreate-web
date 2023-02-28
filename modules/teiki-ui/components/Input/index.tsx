import cx from "classnames";
import * as React from "react";

import InputShell from "../InputShell";

import styles from "./index.module.scss";

const PADDING_LEFT_TO_CLASS_NAME = {
  default: null,
  narrow: styles.paddingLeftNarrow,
  none: styles.paddingLeftNone,
};

const PADDING_RIGHT_TO_CLASS_NAME = {
  default: null,
  narrow: styles.paddingRightNarrow,
  none: styles.paddingRightNone,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  paddingLeft?: keyof typeof PADDING_LEFT_TO_CLASS_NAME;
  paddingRight?: keyof typeof PADDING_RIGHT_TO_CLASS_NAME;
  error?: boolean;
} & Pick<
  React.ComponentProps<typeof InputShell>,
  "topSlot" | "leftSlot" | "rightSlot" | "bottomSlot"
> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export default function Input({
  className,
  style,
  label,
  value,
  onChange,
  paddingLeft = "default",
  paddingRight = "default",
  // props forwarded to <InputShell>
  topSlot,
  leftSlot,
  rightSlot,
  bottomSlot,
  error,
  // props forwarded to <input>
  ...others
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {label ? <div className={styles.label}>{label}</div> : null}
      <InputShell
        topSlot={topSlot}
        leftSlot={leftSlot}
        rightSlot={rightSlot}
        bottomSlot={bottomSlot}
        error={error}
      >
        <input
          className={cx(
            styles.input,
            PADDING_LEFT_TO_CLASS_NAME[paddingLeft],
            PADDING_RIGHT_TO_CLASS_NAME[paddingRight],
            error ? styles.error : null
          )}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          {...others}
        />
      </InputShell>
    </div>
  );
}
