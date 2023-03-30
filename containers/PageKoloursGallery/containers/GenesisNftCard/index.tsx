import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import styles from "./index.module.scss";

import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: GenesisKreationEntry | undefined;
};

export default function GenesisNftCard({ className, style, value }: Props) {
  if (!value) {
    return (
      <div className={cx(styles.container, className)} style={style}>
        LOADING
      </div>
    );
  }

  return (
    <div className={cx(styles.container, className)} style={style}>
      <WithAspectRatio aspectRatio={2 / 1}>
        <ImageView
          className={styles.image}
          src={value.finalImage.src}
          crop={{ x: 0, y: 0, w: 1, h: 1 }}
        />
      </WithAspectRatio>
      <Flex.Col padding="24px" gap="16px">
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div content="Name" size="bodySmall" color="ink80" />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={value.name}
              size="heading6"
              color="ink"
              fontWeight="semibold"
            />
          </Flex.Cell>
        </Flex.Row>
        <Flex.Row justifyContent="space-between" alignItems="center">
          <Flex.Cell>
            <Typography.Div content="Owner" size="bodySmall" color="ink80" />
          </Flex.Cell>
          <Flex.Cell>
            <Typography.Div
              content={
                <InlineAddress.Auto
                  value={value.userAddress ? value.userAddress : ""}
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
        {value.description?.length ? (
          <>
            <Divider$Horizontal$CustomDash />
            <Flex.Row justifyContent="space-between" alignItems="center">
              <Flex.Cell>
                {/* TODO: @sk-yagi: Update this along with the new description UI later */}
                <Typography.Div
                  content={value.description.join("")}
                  size="bodySmall"
                  color="ink80"
                />
              </Flex.Cell>
            </Flex.Row>
          </>
        ) : null}
      </Flex.Col>
    </div>
  );
}
