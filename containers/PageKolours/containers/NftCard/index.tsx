import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import CompleteIndicator from "../../components/CompleteIndicator";

import PaletteBar from "./components/PaletteBar";
import IconMinted from "./icons/IconMinted";
import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { Kolours } from "@/modules/kolours/types";
import ImageView from "@/modules/teiki-components/components/ImageView";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolours.GenesisKreationEntry;
  onClick?: () => void;
};

// TODO: @sk-kitsune: implement this component properly
export default function NftCard({ className, style, value, onClick }: Props) {
  const discountPercentage =
    BigInt(100) - (BigInt(value.fee) * BigInt(100)) / BigInt(value.listedFee);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.box} onClick={onClick}>
        <WithAspectRatio aspectRatio={5 / 3} className={styles.image}>
          <ImageView
            className={styles.image}
            src={value.initialImage.src}
            crop={{ x: 0, y: 0, w: 1, h: 1 }}
          />
          {value.palette.map((item, index) => (
            <ImageView
              key={index}
              className={styles.image}
              style={{ opacity: item.status !== "free" ? "100%" : "0%" }}
              src={item.image.src}
              crop={{ x: 0, y: 0, w: 1, h: 1 }}
            />
          ))}
          {value.status === "booked" || value.status === "minted" ? (
            <IconMinted className={styles.minted} />
          ) : (
            <CompleteIndicator
              value={value.palette}
              className={styles.indicator}
            />
          )}
          <Typography.Div
            content={`${discountPercentage}% OFF`}
            color="white"
            className={styles.discount}
            size="heading6"
          />
        </WithAspectRatio>
        <Flex.Row
          justifyContent="space-between"
          alignContent="center"
          padding="16px 24px"
          className={styles.wrap}
        >
          <PaletteBar value={value.palette} className={styles.bar} />
          <Flex.Row alignItems="center" gap="12px">
            <Typography.Span
              content={
                value.fee != null
                  ? formatLovelaceAmount(value.fee, {
                      compact: true,
                      includeCurrencySymbol: true,
                    })
                  : "-"
              }
              size="heading6"
            />
            <Typography.Span
              content={
                value.listedFee != null
                  ? formatLovelaceAmount(value.listedFee, {
                      compact: true,
                      includeCurrencySymbol: true,
                    })
                  : "-"
              }
              size="bodySmall"
              color="secondary50"
              style={{ textDecoration: "line-through" }}
            />
          </Flex.Row>
        </Flex.Row>
      </div>
    </div>
  );
}
