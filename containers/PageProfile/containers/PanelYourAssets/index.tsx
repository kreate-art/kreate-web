import cx from "classnames";
import Image from "next/image";
import React from "react";

import svgAda from "./assets/ada.svg";
import svgTeiki from "./assets/teiki.svg";
import styles from "./index.module.scss";

import { LovelaceAmount, MicroTeikiAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  lovelaceAmount: LovelaceAmount | undefined;
  microTeikiAmount: MicroTeikiAmount | undefined;
  error: DisplayableError | unknown | undefined;
};

export default function PanelYourAssets({
  className,
  style,
  lovelaceAmount,
  microTeikiAmount,
  error,
}: Props) {
  const displaybleError = React.useMemo(() => {
    return error != null ? DisplayableError.from(error) : undefined;
  }, [error]);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col>
        <Flex.Row padding="20px 32px">
          <Typography.Div size="heading5" color="ink" content="Your Assets" />
        </Flex.Row>
        <Divider.Horizontal />
        <Flex.Row>
          <Flex.Col
            padding="48px 32px"
            flex="1 1 200px"
            gap="16px"
            justifyContent="center"
            alignItems="center"
          >
            <Image className={styles.svgAda} src={svgAda} alt="ada" />
            <AssetViewer.Ada.Compact
              as="div"
              lovelaceAmount={lovelaceAmount}
              size="heading4"
              color="ink"
            />
            <AssetViewer.Usd.FromAda
              as="div"
              lovelaceAmount={lovelaceAmount}
              size="bodySmall"
              color="ink80"
            />
          </Flex.Col>
          <Divider.Vertical />
          <Flex.Col
            padding="48px 32px"
            flex="1 1 200px"
            gap="16px"
            justifyContent="center"
            alignItems="center"
          >
            <Image className={styles.svgTeiki} src={svgTeiki} alt="teiki" />
            <AssetViewer.Teiki.Standard
              as="div"
              microTeikiAmount={microTeikiAmount}
              size="heading4"
              color="ink"
            />
            <AssetViewer.Usd.FromTeiki
              as="div"
              microTeikiAmount={microTeikiAmount}
              size="bodySmall"
              color="ink80"
            />
          </Flex.Col>
        </Flex.Row>
        {displaybleError ? (
          <Flex.Cell padding="20px 36px">
            <MessageBox
              title={displaybleError.title}
              description={displaybleError.description}
              color="danger"
            />
          </Flex.Cell>
        ) : null}
      </Flex.Col>
    </div>
  );
}
