import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  inverted?: boolean;
  maxLines?: 1 | 2 | 3 | 4 | 5 | "none";
};

export default function ProjectSummary({
  className,
  style,
  value,
  inverted,
  maxLines = 3,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        inverted ? styles.inverted : null
      )}
      style={style}
    >
      <Typography.Div
        content={value}
        size="bodySmall"
        color="ink80"
        maxLines={maxLines}
      />
    </div>
  );
}
