import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { MicroTeikiAmount } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  unclaimedAmount: MicroTeikiAmount | undefined;
  claimedAmount: MicroTeikiAmount | undefined;
  onClickClaim?: () => void;
  onClickHistory?: () => void;
  hideButtonHistory?: boolean;
  hideClaimedAmount?: boolean;
};

export default function PanelProtocolReward$Pure({
  className,
  style,
  unclaimedAmount,
  claimedAmount,
  onClickClaim,
  onClickHistory,
  hideButtonHistory,
  hideClaimedAmount,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="20px" padding="24px">
        <Title content="Teiki Rewards" color="white" />
        <Divider.Horizontal color="white-10" />
        <Flex.Col className={styles.unclaimed} gap="8px">
          <div>Unclaimed</div>
          <div>
            <AssetViewer.Teiki.Standard
              microTeikiAmount={unclaimedAmount}
              as="span"
              color="white"
              size="heading3"
            />
            {/* TODO: @sk-kitsune: display usd when we have data */}
            {/* <span className={styles.usd}>≈ $999,999.99</span> */}
          </div>
        </Flex.Col>
        {!hideClaimedAmount ? (
          <>
            <Divider.Horizontal color="white-10" />
            <Flex.Col className={styles.claimed} gap="8px">
              <div>Claimed</div>
              <div>
                <AssetViewer.Teiki.Standard
                  microTeikiAmount={claimedAmount}
                  as="span"
                  color="white"
                  size="body"
                />
                {/* TODO: @sk-kitsune: display usd when we have data */}
                {/* <span className={styles.usd}>≈ $999,999.99</span> */}
              </div>
            </Flex.Col>
          </>
        ) : null}
        <Button.Solid
          content="Claim Now"
          color="white"
          onClick={onClickClaim}
          disabled={!unclaimedAmount}
        />
        {!hideButtonHistory ? (
          <Button.Outline
            content="History"
            color="white"
            onClick={onClickHistory}
          />
        ) : null}
      </Flex.Col>
    </div>
  );
}
