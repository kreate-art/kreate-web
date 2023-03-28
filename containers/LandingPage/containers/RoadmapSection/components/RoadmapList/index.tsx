import cx from "classnames";
import * as React from "react";

import IconCompleted from "../../icons/IconCompleted";
import IconRunning from "../../icons/IconRunning";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";

function Root({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <ul className={cx(styles.root, className)} style={style}>
      {children}
    </ul>
  );
}

function Uncompleted({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className={cx(styles.uncompleted, className)} style={style}>
      <span>{children}</span>
    </li>
  );
}

function Running({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className={cx(styles.running, className)} style={style}>
      <Flex.Row gap="10px">
        <Flex.Row
          flex="0 0 auto"
          padding="4px 8px"
          justifyContent="center"
          gap="8px"
          className={cx(styles.statusCard, styles.running)}
        >
          <IconRunning />
          <span>Running</span>
        </Flex.Row>
        <Flex.Row flex="1 1 0" className={styles.children}>
          {children}
        </Flex.Row>
      </Flex.Row>
    </li>
  );
}

function Completed({
  className,
  style,
  content,
  children = content,
}: {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className={cx(styles.completed, className)} style={style}>
      <Flex.Row gap="10px">
        <Flex.Row
          flex="0 0 auto"
          padding="4px 8px"
          justifyContent="center"
          gap="8px"
          className={cx(styles.statusCard, styles.completed)}
        >
          <IconCompleted />
          <span>Completed</span>
        </Flex.Row>
        <Flex.Row flex="1 1 0" className={styles.children}>
          {children}
        </Flex.Row>
      </Flex.Row>
    </li>
  );
}

const RoadmapList = Object.assign(Root, { Uncompleted, Completed, Running });

export default RoadmapList;
