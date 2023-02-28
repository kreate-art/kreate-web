import cx from "classnames";
import * as React from "react";

import Flex from "../Flex";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  content?: React.ReactNode;
  contentClassName?: string;
  children?: React.ReactNode;
  title?: string;
};

export default function ImpactfulNumber({
  className,
  style,
  icon,
  label,
  content,
  contentClassName,
  title,
  children,
}: Props) {
  return (
    <div
      className={cx(styles.container, className)}
      style={style}
      title={title}
    >
      <Flex.Row gap="24px">
        {icon ? <Flex.Cell flex="0 0 auto">{icon}</Flex.Cell> : null}
        <Flex.Col gap="8px">
          {label ? (
            <Flex.Cell className={styles.label}>{label}</Flex.Cell>
          ) : null}
          {content || children ? (
            <Flex.Cell className={cx(contentClassName, styles.content)}>
              {content || children}
            </Flex.Cell>
          ) : null}
        </Flex.Col>
      </Flex.Row>
    </div>
  );
}
