import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

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
        <Typography.H1
          size="heading2"
          color="secondary"
          content={title}
          title={title}
          maxLines={2}
        />
        <Typography.Div
          size="heading4"
          color="ink80"
          content={slogan}
          title={slogan}
          maxLines={2}
        />
      </Flex.Col>
    </div>
  );
}
