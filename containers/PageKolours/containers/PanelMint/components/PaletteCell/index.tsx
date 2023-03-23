import cx from "classnames";
import * as React from "react";

import { PaletteItem } from "../../../../kolours-types";

import styles from "./index.module.scss";
import { getPerceivedLuminance } from "./utils";

import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  paletteItem: PaletteItem;
  checked: boolean;
  fill: true;
  onCheckedChange?: (checked: boolean) => void;
};

export default function PaletteCell({
  className,
  style,
  paletteItem,
  checked,
  onCheckedChange,
}: Props) {
  const isDark = getPerceivedLuminance(paletteItem.color) < 0.5;

  return (
    <div
      className={cx(styles.container, className)}
      style={{ backgroundColor: paletteItem.color, ...style }}
    >
      <Flex.Col alignItems="center" gap="24px">
        <Checkbox value={checked} onChange={onCheckedChange} />
        <Flex.Col style={{ textAlign: "center" }} alignContent="center">
          <Typography.Div
            content={paletteItem.color}
            size="bodyExtraSmall"
            color={isDark ? "white" : "ink"}
          />
          <Typography.Div>
            <AssetViewer.Ada.Compact
              as="span"
              lovelaceAmount={paletteItem.fee}
              size="bodyExtraSmall"
              fontWeight="semibold"
              color={isDark ? "white" : "ink"}
            />
            <Typography.Span content=" " />
            <AssetViewer.Ada.Compact
              style={{ textDecoration: "line-through" }}
              as="span"
              lovelaceAmount={paletteItem.listedFee}
              size="bodyExtraSmall"
              color={isDark ? "white" : "ink"}
            />
          </Typography.Div>
        </Flex.Col>
      </Flex.Col>
    </div>
  );
}
