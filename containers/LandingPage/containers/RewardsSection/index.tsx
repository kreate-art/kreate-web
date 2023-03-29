import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import IconBulletPoint from "./components/IconBulletPoint";
import humanFigure1 from "./images/human-figure-1.png";
import humanFigure2 from "./images/human-figure-2.png";
import kreationNft from "./images/kreation-nft.png";
import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Carousel from "@/modules/teiki-components/components/Carousel";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function RewardSection({ className, style }: Props) {
  const kolours = [
    "#375267",
    "#B44866",
    "#EBDED2",
    "#E69C4D",
    "#6DBDB9",
    "#CC9883",
    "#B482AB",
    "#98C1BE",
    "#DDBEA7",
    "#D6AEBC",
  ];
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const isSizeSmall = containerSize && containerSize.w <= 1160;
  return (
    <div
      ref={setContainerElement}
      className={className}
      style={style}
      id="rewards"
    >
      <div className={styles.rewardsTitle}>Your Rewards</div>
      <Carousel
        gap="medium"
        maxItemWidth={1328}
        style={{ marginTop: "64px" }}
        indicatorPosition="bottom"
      >
        <div className={styles.itemCarouselContainer}>
          <div className={styles.upperItem}>
            <Typography.Div
              color="white"
              content="Kolour NFT"
              size="heading2"
            />
            <Flex.Row flexWrap="wrap" paddingTop="32px">
              <Flex.Col
                flex="1 1 0"
                padding="0 32px 32px 0px"
                gap="24px"
                minWidth="500px"
              >
                <div className={styles.kolourList}>
                  {kolours.map((kolour) => (
                    <div
                      key={kolour}
                      className={styles.kolour}
                      style={{ backgroundColor: kolour }}
                    />
                  ))}
                </div>
                <Image
                  className={styles.figure}
                  src={humanFigure1}
                  alt="human-figure-1"
                />
              </Flex.Col>
              {!isSizeSmall ? <Divider.Vertical color="white-10" /> : null}
              <Flex.Col
                flex="1 1 0"
                padding="0px 0px 32px 32px"
                minWidth="500px"
              >
                <div className={cx(styles.subTitle, styles.white)}>
                  <IconBulletPoint />
                  <span>Kolour the Kreataverse</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Only minted kolours can be used for Kreator studio, merch and
                  new NFT collections.
                </Typography.Div>
                <Divider.Horizontal
                  className={styles.divider}
                  color="white-10"
                />
                <div className={cx(styles.subTitle, styles.orange)}>
                  <IconBulletPoint />
                  <span>Royalty</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Get a 1% minting fee from future NFTs that use your kolours.
                </Typography.Div>
                <Divider.Horizontal
                  className={styles.divider}
                  color="white-10"
                />
                <div className={cx(styles.subTitle, styles.white)}>
                  <IconBulletPoint />
                  <span>Early Kreator NFT</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Kolour NFT holders are eligible for early-minting a Kreator
                  NFT.
                </Typography.Div>
              </Flex.Col>
            </Flex.Row>
          </div>
          <Divider.Horizontal color="white-10" />
          <Flex.Col padding="32px 80px">
            <Typography.Div color="white50">
              <Typography.Span content="Kolour NFT holders will " />
              <Typography.Span color="white" content="get a $KREATE airdrop" />
              <Typography.Span content=" proportionally to their holding value." />
            </Typography.Div>
            <Typography.Div color="white50">
              <Typography.Span content="$KREATE is the utility token of the " />
              <Link href="/">
                <span className={styles.link}>Kreate platform</span>
              </Link>
              <Typography.Span content=" and is highly beneficial to Kreators and Members." />
            </Typography.Div>
            <Typography.Div color="white50">
              <Typography.Span content="Follow us on " />
              <Link href="https://twitter.com/KreatePlatform">
                <span className={styles.link}>Twitter</span>
              </Link>
              <Typography.Span content=" and " />
              <Link href="https://discord.gg/kreate">
                <span className={styles.link}>Discord</span>
              </Link>
              <Typography.Span content=" for the $KREATE campaign in April 2023." />
            </Typography.Div>
          </Flex.Col>
        </div>
        <div className={styles.itemCarouselContainer}>
          <div className={styles.upperItem}>
            <Typography.Div
              color="white"
              content="Genesis Kreation NFT"
              size="heading2"
            />
            <Flex.Row flexWrap="wrap" paddingTop="32px">
              <Flex.Col
                flex="1 1 0"
                padding="0 32px 32px 0px"
                gap="24px"
                minWidth="500px"
              >
                <div className={styles.kreationNftContainer}>
                  <Image
                    src={kreationNft}
                    alt="kreation-nft"
                    className={styles.kreationNft}
                  />
                </div>
                <Image
                  className={styles.figure}
                  src={humanFigure2}
                  alt="human-figure-2"
                />
              </Flex.Col>
              <Divider.Vertical color="white-10" />
              <Flex.Col
                flex="1 1 0"
                padding="0px 0px 32px 32px"
                minWidth="500px"
              >
                <div className={cx(styles.subTitle, styles.white)}>
                  <IconBulletPoint />
                  <span>Kreate your Region</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Name the region you now own. You can build it in 3D once the
                  Kreataverse is live in Q4/2023.
                </Typography.Div>
                <Divider.Horizontal
                  className={styles.divider}
                  color="white-10"
                />
                <div className={cx(styles.subTitle, styles.orange)}>
                  <IconBulletPoint />
                  <span>Royalty</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Get a 10% royalty from Kreator Studios, businesses, and ads on
                  your region.
                </Typography.Div>
                <Divider.Horizontal
                  className={styles.divider}
                  color="white-10"
                />
                <div className={cx(styles.subTitle, styles.white)}>
                  <IconBulletPoint />
                  <span>Free Kreator NFT</span>
                </div>
                <Typography.Div
                  color="white50"
                  size="body"
                  style={{ marginTop: "16px" }}
                >
                  Genesis Kreation NFT holders get a FREE Kreator NFT.
                </Typography.Div>
              </Flex.Col>
            </Flex.Row>
          </div>
          <Divider.Horizontal color="white-10" />
          <Flex.Col padding="32px 80px">
            <Typography.Div color="white50">
              <Typography.Span content="Genesis Kreation NFT holders will " />
              <Typography.Span color="white" content="get a $KREATE airdrop" />
              <Typography.Span content=" proportionally to their holding value." />
            </Typography.Div>
            <Typography.Div color="white50">
              <Typography.Span content="$KREATE is the utility token of the " />
              <Link href="/">
                <span className={styles.link}>Kreate platform</span>
              </Link>
              <Typography.Span content=" and is highly beneficial to Kreators and Members." />
            </Typography.Div>
            <Typography.Div color="white50">
              <Typography.Span content="Follow us on " />
              <Link href="https://twitter.com/KreatePlatform">
                <span className={styles.link}>Twitter</span>
              </Link>
              <Typography.Span content=" and " />
              <Link href="https://discord.gg/kreate">
                <span className={styles.link}>Discord</span>
              </Link>
              <Typography.Span content=" for the $KREATE campaign in April 2023." />
            </Typography.Div>
          </Flex.Col>
        </div>
      </Carousel>
    </div>
  );
}
