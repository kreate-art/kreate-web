import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";
import { formatRatioAsPercentage } from "./utils";

import { LovelaceAmount } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  fee: LovelaceAmount | undefined;
  listedFee: LovelaceAmount | undefined;
};

export default function NftPrice({ className, style, fee, listedFee }: Props) {
  const ratioOff =
    fee != null && listedFee != null && fee !== listedFee
      ? (Number(listedFee) - Number(fee)) / Number(listedFee)
      : null;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row
        className={styles.content}
        gap="16px"
        padding="16px 20px"
        alignItems="center"
      >
        {ratioOff != null ? (
          <Typography.Div
            className={styles.saleOff}
            color="white"
            content={formatRatioAsPercentage(ratioOff) + " OFF"}
            fontWeight="semibold"
          />
        ) : null}
        {fee != null ? (
          <AssetViewer.Ada.Standard
            as="div"
            lovelaceAmount={fee}
            size="heading4"
            color="white"
          />
        ) : null}
        {listedFee != null ? (
          <AssetViewer.Ada.Standard
            as="div"
            lovelaceAmount={listedFee}
            style={{
              textDecoration: "line-through",
              color: "white",
              opacity: "50%",
            }}
            color="white"
          />
        ) : null}
      </Flex.Row>
    </div>
  );
}
