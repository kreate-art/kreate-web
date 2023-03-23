import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function BelowNavBar({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Typography.Div color="white50">
        <Typography.Span color="white" content="50-60% discount " />
        <Typography.Span color="white50" content="on minting fees only " />
        <Typography.Span
          color="white"
          content="from March 24th to April 7th "
        />
        <Typography.Span color="white50" content="2023 - " />
        <Typography.Span
          color="white"
          content="Kolour now!"
          fontWeight="semibold"
        />
      </Typography.Div>
    </div>
  );
}
