import cx from "classnames";

import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import { EN_DASH } from "@/modules/teiki-ui/components/AssetViewer/constants";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  members?: number;
  totalPosts?: number;
  exclusivePosts?: number;
  lovelaceStake?: LovelaceAmount;
};

function Col({ children }: { children: React.ReactNode }) {
  return (
    <Flex.Col
      justifyContent="center"
      alignItems="center"
      gap="12px"
      className={styles.col}
      flex="1 1 200px"
    >
      {children}
    </Flex.Col>
  );
}

export default function PanelProjectStatistics({
  style,
  className,
  members,
  totalPosts,
  exclusivePosts,
  lovelaceStake,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row flexWrap="wrap" gap="1px">
        <Col>
          <Typography.Div
            size="heading4"
            color="secondary"
            content={
              members != null ? members.toLocaleString("en-US") : EN_DASH
            }
          />
          <Typography.Div color="secondary" size="bodySmall" content="fans" />
        </Col>
        <Col>
          <Typography.Div
            size="heading4"
            color="secondary"
            content={
              totalPosts != null ? totalPosts.toLocaleString("en-US") : EN_DASH
            }
          />
          <Typography.Div
            color="secondary"
            size="bodySmall"
            content="total posts"
          />
        </Col>
        <Col>
          <Typography.Div
            size="heading4"
            color="secondary"
            content={
              exclusivePosts != null
                ? exclusivePosts.toLocaleString("en-US")
                : EN_DASH
            }
          />
          <Typography.Div
            color="secondary"
            size="bodySmall"
            content="exclusive posts"
          />
        </Col>
        <Col>
          <Typography.Div size="heading4" color="secondary">
            <AssetViewer.Ada.Standard
              as="span"
              lovelaceAmount={lovelaceStake}
            />
          </Typography.Div>
          <Typography.Div
            color="secondary"
            size="bodySmall"
            content="total ADA stake"
          />
        </Col>
        <Col>
          <Typography.Div size="heading4" color="secondary">
            {/** NOTE: @sk-tenba:
             * monthly income = numLovelacesStaked * 3.5% / 12
             */}
            <AssetViewer.Usd.FromAda
              as="span"
              lovelaceAmount={
                lovelaceStake
                  ? (BigInt(lovelaceStake) * BigInt(35)) / BigInt(12000)
                  : undefined
              }
            />
          </Typography.Div>
          <Typography.Div
            color="secondary"
            size="bodySmall"
            content="monthly income"
          />
        </Col>
      </Flex.Row>
    </div>
  );
}
