import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

const MAX_WIDTH_TO_CLASS_NAME = {
  medium: styles.maxWidthMedium,
  small: styles.maxWidthSmall,
};

const TEXT_ALIGN_TO_CLASS_NAME = {
  left: styles.textAlignLeft,
  center: styles.textAlignCenter,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  maxWidth?: keyof typeof MAX_WIDTH_TO_CLASS_NAME;
  textAlign?: keyof typeof TEXT_ALIGN_TO_CLASS_NAME;
} & Pick<React.CSSProperties, "marginTop" | "marginBottom">;

export default function Section({
  className,
  style,
  children,
  maxWidth = "medium",
  textAlign = "center",
  ...others
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        className,
        MAX_WIDTH_TO_CLASS_NAME[maxWidth],
        TEXT_ALIGN_TO_CLASS_NAME[textAlign]
      )}
      style={{ ...others, ...style }}
    >
      <Flex.Row minWidth="100%" justifyContent="center" alignItems="center">
        <Flex.Cell className={styles.content} flex="1 1 0">
          {children}
        </Flex.Cell>
      </Flex.Row>
    </div>
  );
}
