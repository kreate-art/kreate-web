import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  color: string;
  minted: boolean;
  checked: boolean;
  fill: true;
};

export default function PaletteCell({ className, style, color }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col
        style={{ width: "100%", height: "100%", backgroundColor: color }}
        justifyContent="center"
        alignItems="center"
        gap="24px"
      >
        <Checkbox value={false} />
        <Typography.Div content={color} />
      </Flex.Col>
    </div>
  );
}
