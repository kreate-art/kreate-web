import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import pngUserBusinessGenesis from "./assets/user-business-genesis.png";
import pngUserBusinessKolours from "./assets/user-business-kolours.png";
import IconBulletPoint from "./icons/IconBulletPoint";
import styles from "./index.module.scss";

import Carousel from "@/modules/teiki-components/components/Carousel";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function RewardsSectionV2({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Typography.Div
        className={styles.title}
        size="none"
        content="YOUR REWARDS"
        color="white"
      />
      <Carousel indicatorPosition="bottom">
        <Flex.Col className={styles.card} alignItems="stretch">
          <Flex.Row
            padding="24px 48px"
            alignItems="center"
            justifyContent="center"
          >
            <Typography.Div
              content="Kolour NFT"
              color="white"
              size="heading4"
            />
          </Flex.Row>
          <Divider$Horizontal$CustomDash color="white30" />
          <Flex.Row
            justifyContent="stretch"
            flexWrap="wrap"
            gap="20px"
            padding="48px 104px"
          >
            <Flex.Col flex="1 1 300px" gap="12px">
              <Typography.Div color="primary" size="heading5">
                <IconBulletPoint className={styles.bullet} />
                <Typography.Span
                  className={styles.subtitle}
                  content="ROYALTY"
                />
              </Typography.Div>
              <Typography.Div
                color="white50"
                content="Get 1% minting fee from future NFTs that use your kolours."
              />
            </Flex.Col>
            <Flex.Col flex="1 1 300px" gap="12px">
              <Typography.Div color="white" size="heading5">
                <IconBulletPoint className={styles.bullet} />
                <Typography.Span
                  className={styles.subtitle}
                  content="EARLY KREATOR NFT"
                />
              </Typography.Div>
              <Typography.Div
                color="white50"
                content="Kolour NFT holders are eligible for early-minting a Kreator NFT."
              />
            </Flex.Col>
          </Flex.Row>
          <Flex.Cell>
            <Image
              className={styles.figure}
              src={pngUserBusinessKolours}
              alt=""
            />
          </Flex.Cell>
        </Flex.Col>
        <Flex.Col className={styles.card} alignItems="stretch">
          <Flex.Row
            padding="24px 48px"
            alignItems="center"
            justifyContent="center"
          >
            <Typography.Div
              content="Genesis Kreation NFT"
              color="white"
              size="heading4"
            />
          </Flex.Row>
          <Divider$Horizontal$CustomDash color="white30" />
          <Flex.Row
            justifyContent="stretch"
            flexWrap="wrap"
            gap="20px"
            padding="48px 104px"
          >
            <Flex.Col flex="1 1 300px" gap="12px">
              <Typography.Div color="primary" size="heading5">
                <IconBulletPoint className={styles.bullet} />
                <Typography.Span
                  className={styles.subtitle}
                  content="ROYALTY"
                />
              </Typography.Div>
              <Typography.Div
                color="white50"
                content="Get a 10% royalty from Kreator Studios, Personas, Items, etc. on your region."
              />
            </Flex.Col>
            <Flex.Col flex="1 1 300px" gap="12px">
              <Typography.Div color="white" size="heading5">
                <IconBulletPoint className={styles.bullet} />
                <Typography.Span
                  className={styles.subtitle}
                  content="FREE KREATOR NFT"
                />
              </Typography.Div>
              <Typography.Div
                color="white50"
                content="Genesis Kreation NFT holders get a FREE Kreator NFT."
              />
            </Flex.Col>
          </Flex.Row>
          <Flex.Cell>
            <Image
              className={styles.figure}
              src={pngUserBusinessGenesis}
              alt=""
            />
          </Flex.Cell>
        </Flex.Col>
      </Carousel>
      <Flex.Col className={styles.note} padding="32px 80px">
        <Typography.Div color="white">
          <Typography.Span content="Kolour and Genesis Kreation NFT holders will " />
          <Typography.Span content="get a $KREATE airdrop" />
          <Typography.Span content=" proportionally to their holding value." />
        </Typography.Div>
        <Typography.Div color="white">
          <Typography.Span content="$KREATE is the utility token of the " />
          <Link className={styles.link} href="https://kreate.community/">
            <Typography.Span content="Kreate platform" />
          </Link>
          <Typography.Span content=" and is highly beneficial to Kreators and Members." />
        </Typography.Div>
        <Typography.Div color="white">
          <Typography.Span content="Follow us on " />
          <Link
            className={styles.link}
            href="https://twitter.com/KreatePlatform"
          >
            <Typography.Span content="Twitter" />
          </Link>
          <Typography.Span content=" and " />
          <Link className={styles.link} href="https://discord.gg/kreate">
            <Typography.Span content="Discord" />
          </Link>
          <Typography.Span content=" for the $KREATE campaign in April 2023." />
        </Typography.Div>
      </Flex.Col>
    </div>
  );
}
