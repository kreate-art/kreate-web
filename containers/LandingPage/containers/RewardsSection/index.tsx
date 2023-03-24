import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

import IconSwatches from "../NftCollection/components/IconSwatches";

import humanFigure1 from "./images/human-figure-1.png";
import humanFigure2 from "./images/human-figure-2.png";
import kreationNft from "./images/kreation-nft.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
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
  return (
    <div className={className} style={style}>
      <div className={styles.rewardsTitle}>Your Rewards</div>
      <div className={styles.gridContainer}>
        <div className={styles.upperGrid}>
          <div className={styles.grid}>
            <Typography.Div
              color="none"
              size="heading2"
              style={{ color: "#EC5929" }}
              content="Kolour NFT"
            />
            <div className={styles.kolourList}>
              {kolours.map((kolour) => (
                <div
                  key={kolour}
                  className={styles.kolour}
                  style={{ backgroundColor: kolour }}
                />
              ))}
            </div>
            <div className={styles.infoCardContainer}>
              <div className={cx(styles.infoCard, styles.gray)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Kolour the Kreataverse"
                />
                <div className={styles.infoBody}>
                  Only minted kolours can be used for Kreator studio, merch and
                  new NFT collections.
                </div>
              </div>
              <div className={cx(styles.infoCard, styles.green)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Royalty"
                />
                <div className={styles.infoBody}>
                  Get a % minting fee from future NFTs that use your kolours.
                </div>
              </div>
              <div className={cx(styles.infoCard, styles.gray)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Early Kreator NFT"
                />
                <div className={styles.infoBody}>
                  Kolour NFT holders are eligible for early-minting a Kreator
                  NFT.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.grid} style={{ gridArea: "b" }}>
            <Typography.Div
              size="heading2"
              color="none"
              style={{ color: "#EC5929" }}
              content="Genesis Kreation NFT"
            />
            <div className={styles.kreationNftContainer}>
              <ImageView
                src={kreationNft.src}
                className={styles.imageView}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </div>
            <div className={styles.infoCardContainer}>
              <div className={cx(styles.infoCard, styles.gray)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Kreate your land"
                />
                <div className={styles.infoBody}>
                  Name the land you now own. You can build your 3D land once the
                  Kreataverse is live.
                </div>
              </div>
              <div className={cx(styles.infoCard, styles.green)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Royalty"
                />
                <div className={styles.infoBody}>
                  Get a % revenue share from future Kreator studios and
                  businesses on your land.
                </div>
              </div>
              <div className={cx(styles.infoCard, styles.gray)}>
                <Typography.Div
                  size="heading3"
                  color="white"
                  content="Free Kreator NFT"
                />
                <div className={styles.infoBody}>
                  Genesis Kreation NFT holders get a FREE Kreator NFT.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cx(styles.grid, styles.bottomGrid)}
          style={{ gridArea: "c" }}
        >
          <div className={styles.figureContainer}>
            <div>
              <Image
                className={styles.figure}
                src={humanFigure1}
                alt="human-figure-1"
              />
            </div>
            <div>
              <Image
                className={styles.figure}
                src={humanFigure2}
                alt="human-figure-2"
              />
            </div>
          </div>
          <Typography.Div color="white" className={styles.infoBottomGrid}>
            <div>
              Kolour and Genesis Kreation NFT holders will{" "}
              <b>get a $KREATE airdrop </b>
              proportionally to their holding value.
            </div>
            <div>
              $KREATE is the utility token of the{" "}
              <Link className={styles.link} href="https://kreate.community/">
                Kreate platform
              </Link>{" "}
              and is highly beneficial to Kreators and Members.
            </div>
            <div>
              Follow us on{" "}
              <Link
                className={styles.link}
                href="https://twitter.com/KreatePlatform"
              >
                Twitter
              </Link>{" "}
              and{" "}
              <Link
                className={styles.link}
                href="https://discord.gg/4wv3MfKHdE"
              >
                Discord
              </Link>{" "}
              for the $KREATE campaign in April 2023.
            </div>
          </Typography.Div>
        </div>
      </div>
      <Link href="/kolours" className={styles.kolourButtonContainer}>
        <div className={styles.kolourButton}>
          <IconSwatches />
          <Typography.Span size="heading5" content="Farm the Kreataverse" />
        </div>
      </Link>
    </div>
  );
}
