import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import styles from "./index.module.scss";

import { GenesisKreation$Gallery } from "@/modules/kolours/types/Kolours";
import ImageView from "@/modules/teiki-components/components/ImageView";
import AddressViewer from "@/modules/teiki-ui/components/AddressViewer";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

const BORDER_TO_CLASS_NAME = {
  solid: styles.borderSolid,
  none: styles.borderNone,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: GenesisKreation$Gallery | undefined;
  border?: keyof typeof BORDER_TO_CLASS_NAME;
};

export default function GenesisNftCard({
  className,
  style,
  value,
  border = "none",
}: Props) {
  if (!value) {
    return (
      <div
        className={cx(
          styles.container,
          className,
          BORDER_TO_CLASS_NAME[border]
        )}
        style={style}
      >
        LOADING
      </div>
    );
  }

  return (
    <div
      className={cx(styles.container, className, BORDER_TO_CLASS_NAME[border])}
      style={style}
    >
      <Link href={`/gallery/${value.slug}`}>
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
                  <AddressViewer
                    size={"heading6"}
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
      </Link>
    </div>
  );
}
