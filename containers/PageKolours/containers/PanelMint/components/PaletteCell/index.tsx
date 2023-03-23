import cx from "classnames";
import * as React from "react";

import { PaletteItem } from "../../../../kolours-types";
import { toHexColor } from "../../../../utils";
import IconMinted from "../../icons/IconMinted";

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
  const isDark = getPerceivedLuminance(paletteItem.kolour) < 0.5;

  return (
    <div
      className={cx(styles.container, className)}
      style={{ backgroundColor: toHexColor(paletteItem.kolour), ...style }}
    >
      {/* TODO: distinguish "booked" and "minted" */}
      {paletteItem.status !== "free" ? (
        <IconMinted
          style={{
            width: "96px",
            height: "96px",
            color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
          }}
        />
      ) : (
        <Flex.Col alignItems="center" gap="24px">
          <Checkbox value={checked} onChange={onCheckedChange} />
          <Flex.Col style={{ textAlign: "center" }} alignContent="center">
            <Typography.Div
              content={toHexColor(paletteItem.kolour)}
              size="bodyExtraSmall"
              color={isDark ? "white" : "ink"}
            />
            <Typography.Div size="bodyExtraSmall">
              <AssetViewer.Ada.Compact
                as="span"
                lovelaceAmount={paletteItem.fee}
                fontWeight="semibold"
                color={isDark ? "white" : "ink"}
              />
              <Typography.Span content=" " />
              {paletteItem.listedFee != null &&
              paletteItem.listedFee !== paletteItem.fee ? (
                <AssetViewer.Ada.Compact
                  style={{ textDecoration: "line-through" }}
                  as="span"
                  lovelaceAmount={paletteItem.listedFee}
                  color={isDark ? "white" : "ink"}
                />
              ) : null}
            </Typography.Div>
          </Flex.Col>
        </Flex.Col>
      )}
    </div>
  );
}
