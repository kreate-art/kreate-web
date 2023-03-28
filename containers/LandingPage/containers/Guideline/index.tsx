import cx from "classnames";
import Image from "next/image";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import stepFour from "./images/step-four.png";
import stepTwo from "./images/step-two.png";
import styles from "./index.module.scss";

import Carousel from "@/modules/teiki-components/components/Carousel";
import ImageView from "@/modules/teiki-components/components/ImageView";
import {
  LogoWalletEternl,
  LogoWalletFlint,
  LogoWalletGeroWallet,
  LogoWalletNami,
} from "@/modules/teiki-logos";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Guideline({ className, style }: Props) {
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
    <div className={cx(styles.container, className)} style={style}>
      <Carousel gap="thick" maxItemWidth={900} indicatorPosition="bottom">
        {/* Step 1 */}
        <Flex.Col className={styles.box}>
          <Typography.Div
            content="Step 1"
            color="white"
            size="heading4"
            fontWeight="regular"
            className={styles.bangers}
            style={{ textAlign: "center" }}
          />
          <Typography.Div
            content="Connect a Cardano Wallet"
            color="white"
            size="heading2"
            style={{ textAlign: "center" }}
          />
          <Flex.Row gap="8px" justifyContent="center" alignItems="center">
            <Flex.Col className={cx(styles.walletItem, styles.recommended)}>
              <Image
                src={LogoWalletNami}
                alt="logo nami"
                width={32}
                height={32}
              />
              <Typography.Div
                className={styles.walletName}
                size="heading5"
                content="Nami"
                color="white"
                maxLines={1}
              />
              <div className={styles.recommendedText}>Recommended</div>
            </Flex.Col>
            <Flex.Col className={styles.walletItem}>
              <Image
                src={LogoWalletFlint}
                alt="logo flint"
                width={32}
                height={32}
              />
              <Typography.Div
                className={styles.walletName}
                size="heading5"
                content="Flint"
                color="white"
                maxLines={1}
              />
            </Flex.Col>
            <Flex.Col className={styles.walletItem}>
              <Image
                src={LogoWalletEternl}
                alt="logo eternl"
                width={32}
                height={32}
              />
              <Typography.Div
                className={styles.walletName}
                size="heading5"
                content="Eternl"
                color="white"
                maxLines={1}
              />
            </Flex.Col>
            <Flex.Col className={styles.walletItem}>
              <Image
                src={LogoWalletGeroWallet}
                alt="logo gero"
                width={32}
                height={32}
              />
              <Typography.Div
                className={styles.walletName}
                size="heading5"
                content="Gero"
                color="white"
                maxLines={1}
              />
            </Flex.Col>
          </Flex.Row>
        </Flex.Col>
        {/* Step 2 */}
        <Flex.Col alignItems="center" className={styles.box}>
          <Typography.Div
            content="Step 2"
            color="white"
            size="heading4"
            fontWeight="regular"
            className={styles.bangers}
          />
          <Typography.Div
            content="Scope out the Kreataversefor a piece of Genesis Kreation"
            color="white"
            size="heading2"
            style={{ textAlign: "center" }}
          />
          <div style={{ minWidth: "400px", width: "100%" }}>
            <WithAspectRatio aspectRatio={590 / 160}>
              <ImageView
                className={styles.imageView}
                src={stepTwo.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
        {/* Step 3 */}
        <Flex.Col alignItems="center" className={styles.box}>
          <Typography.Div
            content="Step 3"
            color="white"
            size="heading4"
            fontWeight="regular"
            className={styles.bangers}
          />
          <Typography.Div
            content="Mint its Kolours to restore its Kolourway"
            color="white"
            size="heading2"
            style={{ textAlign: "center" }}
          />
          <Flex.Col gap="24px" style={{ width: "100%" }} alignItems="center">
            <div className={styles.kolourList}>
              {kolours.map((kolour) => (
                <div
                  key={kolour}
                  className={styles.kolour}
                  style={{ backgroundColor: kolour }}
                />
              ))}
            </div>
            <div className={styles.mintKolourAction}>Mint Kolours</div>
          </Flex.Col>
        </Flex.Col>
        {/* Step 4 */}
        <Flex.Col alignItems="center" className={styles.box}>
          <Typography.Div
            content="Step 4"
            color="white"
            size="heading4"
            fontWeight="regular"
            className={styles.bangers}
          />
          <Typography.Div
            content="Mint your piece of Genesis Kreation"
            color="white"
            size="heading2"
            style={{ textAlign: "center" }}
          />
          <div style={{ minWidth: "400px", width: "100%" }}>
            <WithAspectRatio aspectRatio={552 / 252}>
              <ImageView
                className={styles.imageView}
                src={stepFour.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
        {/* Step 5 */}
        <Flex.Col alignItems="center" className={styles.box}>
          <Typography.Div
            content="Step 5"
            color="white"
            size="heading4"
            fontWeight="regular"
            className={styles.bangers}
          />
          <Typography.Div
            content="Enjoy the fruits of your Kreation"
            color="white"
            size="heading2"
            style={{ textAlign: "center" }}
          />
          <Flex.Col minWidth={"500px"} flex="1 1 0" style={{ width: "100%" }}>
            <div className={styles.stepContainer}>
              <div className={styles.fruitTable}>
                <div
                  className={styles.royaltyFeesContainer}
                  style={{ gridArea: "a" }}
                >
                  Royalties
                </div>
                <div
                  className={styles.royaltyFeesChild}
                  style={{ gridArea: "b" }}
                >
                  KreAtaverse Ownership
                </div>
                <div
                  className={styles.royaltyFeesChild}
                  style={{ gridArea: "c" }}
                >
                  Kreator NFT
                </div>
                <div
                  className={styles.royaltyFeesChild}
                  style={{ gridArea: "d" }}
                >
                  Free $KREATE
                </div>
              </div>
            </div>
          </Flex.Col>
        </Flex.Col>
      </Carousel>
    </div>
  );
}
