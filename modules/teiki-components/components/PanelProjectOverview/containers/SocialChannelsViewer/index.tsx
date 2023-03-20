import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";

import ButtonSocialChannel from "./components/ButtonSocialChannel";
import styles from "./index.module.scss";

import { ProjectCommunity } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectCommunity["socialChannels"];
};

export default function SocialChannelsViewer({
  className,
  style,
  value,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        <Flex.Cell className={styles.label} flex="0 0 auto">
          {"Social: "}
        </Flex.Cell>
        <Flex.Row gap="12px" flexWrap="wrap">
          {!value.length ? (
            <span style={{ lineHeight: "40px", color: "rgba(0, 0, 0, 0.6)" }}>
              {"-"}
            </span>
          ) : (
            value.map((item, index) => (
              <ButtonSocialChannel key={index} value={item} />
            ))
          )}
        </Flex.Row>
      </Flex.Row>
    </div>
  );
}
