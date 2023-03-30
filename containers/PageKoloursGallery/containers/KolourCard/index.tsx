import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import { getPerceivedLuminance } from "../../../PageKolours/containers/PanelMint/components/PaletteCell/utils";
import { toHexColor } from "../../../PageKolours/utils";

import styles from "./index.module.scss";

import { Kolours } from "@/modules/kolours/types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

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
      <Link href={`/kolour/${value.kolour}`}>
        <Flex.Row
          style={{
            backgroundColor: toHexColor(value.kolour),
            cursor: "pointer",
          }}
          justifyContent="center"
          alignItems="center"
          padding="96px"
        >
          <Typography.Div
            content={toHexColor(value.kolour)}
            color={isDark ? "white" : "ink"}
          />
        </Flex.Row>
      </Link>
      <Flex.Col gap="16px" padding="24px">
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div content="Owner" size="bodySmall" color="ink80" />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={<InlineAddress.Auto value={value.userAddress} />}
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
              content={
                <AssetViewer.Ada.Standard
                  as="span"
                  lovelaceAmount={value.fee}
                />
              }
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
              content="1%"
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div
              content="Expected Earning"
              size="bodySmall"
              color="ink80"
            />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={
                <AssetViewer.Ada.Compact
                  as="span"
                  lovelaceAmount={value.expectedEarning ?? undefined}
                />
              }
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}
