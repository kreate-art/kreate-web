import cx from "classnames";
import * as React from "react";

import InputShell from "../InputShell";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  resizable?: boolean;
  rows?: number;
  value: string;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement> | undefined;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement> | undefined;
} & Pick<
  React.ComponentProps<typeof InputShell>,
  "topSlot" | "leftSlot" | "rightSlot" | "bottomSlot"
> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">;

/** TODO: @sk-tenba: handle the disabled case */
export default function TextArea({
  className,
  style,
  onChange,
  resizable,
  value,
  rows = 5,
  // props forwarded to <InputShell>
  topSlot,
  leftSlot,
  rightSlot,
  bottomSlot,
  // props forwarded to <textarea>
  ...others
}: Props) {
  return (
    <InputShell
      className={cx(
        styles.container,
        className,
        resizable ? styles.resizable : null
      )}
      style={style}
      topSlot={topSlot}
      leftSlot={leftSlot}
      rightSlot={rightSlot}
      bottomSlot={bottomSlot}
    >
      <div className={styles.textareaContainer}>
        <textarea
          className={styles.textarea}
          onChange={(e) => onChange && onChange(e.target.value)}
          value={value}
          rows={rows}
          {...others}
        />
      </div>
    </InputShell>
  );
}
