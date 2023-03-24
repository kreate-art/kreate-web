import cx from "classnames";
import * as React from "react";

import { getPerceivedLuminance } from "../../../PageKolours/containers/PanelMint/components/PaletteCell/utils";
import { toHexColor } from "../../../PageKolours/utils";

import styles from "./index.module.scss";

import { Kolours } from "@/modules/kolours/types";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

const EM_DASH = "—";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolours.MintedKolourEntry | undefined;
};

export default function KolourCard({ className, style, value }: Props) {
  if (!value) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        LOADING
      </div>
    );
  }

  const isDark = getPerceivedLuminance(value.kolour) < 0.5;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row
        style={{ backgroundColor: toHexColor(value.kolour) }}
        justifyContent="center"
        alignItems="center"
        padding="96px"
      >
        <Typography.Div
          content={toHexColor(value.kolour)}
          color={isDark ? "white" : "ink"}
        />
      </Flex.Row>
      {/* <Flex.Col gap="16px" padding="24px">
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div content="Owner" size="bodySmall" color="ink80" />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={EM_DASH}
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div
              content="Minted Fee"
              size="bodySmall"
              color="ink80"
            />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={EM_DASH}
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div
              content="Royalty Fee"
              size="bodySmall"
              color="ink80"
            />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={EM_DASH}
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
      </Flex.Col> */}
    </div>
  );
}
