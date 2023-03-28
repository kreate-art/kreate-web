import cx from "classnames";
import * as React from "react";

import IconCompleted from "../../icons/IconCompleted";
import IconUncompleted from "../../icons/IconUncompleted";

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
      <Flex.Row gap="10px">
        <Flex.Row flex="0 0 auto">
          <IconUncompleted />
        </Flex.Row>
        <Flex.Cell flex="1 1 0">{children}</Flex.Cell>
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
        <Flex.Row flex="0 0 auto">
          <IconCompleted />
        </Flex.Row>
        <Flex.Cell flex="1 1 0">{children}</Flex.Cell>
      </Flex.Row>
    </li>
  );
}

const RoadmapList = Object.assign(Root, { Uncompleted, Completed });

export default RoadmapList;
