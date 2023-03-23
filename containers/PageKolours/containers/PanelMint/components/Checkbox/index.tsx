import * as Checkbox$Radix from "@radix-ui/react-checkbox";
import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: boolean;
  id?: string;
  onChange?: (value: boolean) => void;
};

export default function Checkbox({
  className,
  style,
  value,
  id,
  onChange,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Checkbox$Radix.Root
        className={styles.root}
        checked={value}
        id={id}
        onCheckedChange={(value) => {
          typeof value === "boolean" && onChange && onChange(value);
        }}
      >
        <Checkbox$Radix.Indicator className={styles.indicator}>
          <IconCheck />
        </Checkbox$Radix.Indicator>
      </Checkbox$Radix.Root>
    </div>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5.4 12 4.24 4.24 8.49-8.48"
      />
    </svg>
  );
}
