import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  slogan: string;
};

export default function TitleSloganViewer({
  className,
  style,
  title,
  slogan,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="4px">
        <Title
          className={styles.title}
          size="h2"
          color="ink"
          content={title}
          title={title}
        />
        <Title
          className={styles.slogan}
          size="h4"
          color="green"
          content={slogan}
          title={slogan}
        />
      </Flex.Col>
    </div>
  );
}
