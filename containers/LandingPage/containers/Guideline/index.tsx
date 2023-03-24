import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import IconSwatches from "../NftCollection/components/IconSwatches";

import stepFour from "./images/step-four.png";
import stepThree from "./images/step-three.png";
import stepTwo from "./images/step-two.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import {
  LogoWalletEternl,
  LogoWalletFlint,
  LogoWalletGeroWallet,
  LogoWalletNami,
} from "@/modules/teiki-logos";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function Guideline({ className, style }: Props) {
  return (
    <div style={style} className={className}>
      {/* Step 1 */}
      <div className={styles.gridContainer}>
        <Flex.Row flexWrap="wrap" className={styles.row} style={style}>
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.leftColumn}
          >
            <div className={styles.stepOneTextContainer}>
              <Typography.Span
                content="Step 1:"
                color="white"
                className={styles.step}
              />
              <Typography.Span
                content="Connect a Cardano Wallet"
                color="white"
                className={styles.action}
              />
            </div>
          </Flex.Col>
          <Divider.Vertical color="white-10" />
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={cx(styles.topRightColumn, styles.rightColumn)}
          >
            <div className={styles.walletContainer}>
              <div className={cx(styles.walletItem, styles.recommended)}>
                <Image
                  src={LogoWalletNami}
                  alt="logo nami"
                  width={64}
                  height={64}
                />
                <Typography.Div
                  className={styles.walletName}
                  size="heading4"
                  content="Nami"
                  color="white"
                />
                <div className={styles.recommendedText}>Recommended</div>
              </div>
              <div className={styles.walletItem}>
                <Image
                  src={LogoWalletFlint}
                  alt="logo nami"
                  width={64}
                  height={64}
                />
                <Typography.Div
                  className={styles.walletName}
                  size="heading4"
                  content="Flint"
                  color="white"
                />
              </div>
              <div className={styles.walletItem}>
                <Image
                  src={LogoWalletEternl}
                  alt="logo nami"
                  width={64}
                  height={64}
                />
                <Typography.Div
                  className={styles.walletName}
                  size="heading4"
                  content="Eternl"
                  color="white"
                />
              </div>
              <div className={styles.walletItem}>
                <Image
                  src={LogoWalletGeroWallet}
                  alt="logo nami"
                  width={64}
                  height={64}
                />
                <Typography.Div
                  className={styles.walletName}
                  size="heading4"
                  content="Gero"
                  color="white"
                />
                <Typography.Div
                  size="heading4"
                  content="Wallet"
                  color="white"
                />
              </div>
            </div>
          </Flex.Col>
        </Flex.Row>

        {/* Step 2 */}
        <Flex.Row flexWrap="wrap" className={styles.row}>
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.leftColumn}
          >
            <div className={styles.stepOneTextContainer}>
              <Typography.Span
                content="Step 2:"
                color="white"
                className={styles.step}
              />
              <Typography.Div
                content={"Scope out the Kreataverse"}
                color="white"
                size="heading2"
              />
              <Typography.Div
                content={
                  <>
                    <span>for a piece of </span>
                    <span style={{ color: "#EC5929" }}>Genesis Kreation</span>
                  </>
                }
                color="white"
                size="heading2"
              />
            </div>
          </Flex.Col>
          <Divider.Vertical color="white-10" />
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.rightColumn}
          >
            <div className={styles.stepOneContainer}>
              <WithAspectRatio aspectRatio={552 / 252}>
                <ImageView
                  className={styles.imageView}
                  src={stepTwo.src}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              </WithAspectRatio>
            </div>
          </Flex.Col>
        </Flex.Row>

        {/* Step 3 */}
        <Flex.Row flexWrap="wrap" className={styles.row}>
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.leftColumn}
          >
            <div className={styles.stepOneTextContainer}>
              <Typography.Div
                content="Step 3:"
                color="white"
                className={styles.step}
              />
              <Typography.Div
                content={
                  <>
                    <span>Mint its </span>
                    <span style={{ color: "#EC5929" }}>Kolours</span>
                  </>
                }
                color="white"
                size="heading2"
              />
              <Typography.Div
                content={"to restore its Kolourway"}
                color="white"
                size="heading2"
              />
            </div>
          </Flex.Col>
          <Divider.Vertical color="white-10" />
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.rightColumn}
          >
            <div className={styles.stepOneContainer}>
              <WithAspectRatio aspectRatio={2208 / 644}>
                <ImageView
                  className={styles.imageView}
                  src={stepThree.src}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              </WithAspectRatio>
            </div>
          </Flex.Col>
        </Flex.Row>

        {/* Step 4 */}
        <Flex.Row flexWrap="wrap" className={styles.row}>
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.leftColumn}
          >
            <div className={styles.stepOneTextContainer}>
              <Typography.Div
                content="Step 4:"
                color="white"
                className={styles.step}
              />
              <Typography.Div
                content={"Mint your piece of"}
                color="white"
                size="heading2"
              />
              <Typography.Div
                content={
                  <span style={{ color: "#EC5929" }}>Genesis Kreation</span>
                }
                size="heading2"
              />
            </div>
          </Flex.Col>
          <Divider.Vertical color="white-10" />
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={styles.rightColumn}
          >
            <div className={styles.stepOneContainer}>
              <WithAspectRatio aspectRatio={552 / 252}>
                <ImageView
                  className={styles.imageView}
                  src={stepFour.src}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              </WithAspectRatio>
            </div>
          </Flex.Col>
        </Flex.Row>

        {/* Step 5 */}
        <Flex.Row flexWrap="wrap" className={styles.row}>
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={cx(styles.leftColumn, styles.lastRow)}
          >
            <div className={styles.stepOneTextContainer}>
              <Typography.Span
                content="Step 5:"
                style={{ color: "#EC5929" }}
                color="white"
                className={styles.step}
              />
              <Typography.Span
                content={
                  <span>
                    <i>Enjoy the fruits of your Kreation</i>
                  </span>
                }
                color="white"
                className={styles.action}
              />
            </div>
          </Flex.Col>
          <Divider.Vertical color="white-10" />
          <Flex.Col
            minWidth={"500px"}
            flex="1 1 0"
            className={cx(styles.rightColumn, styles.lastRow)}
          >
            <div className={styles.stepOneContainer}>
              <div className={styles.fruitTable}>
                <div
                  className={styles.royaltyFeesContainer}
                  style={{ gridArea: "a" }}
                >
                  Royalty fees
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
        </Flex.Row>
      </div>
      <Link href="/kolours" className={styles.kolourButtonContainer}>
        <div className={styles.kolourButton}>
          <IconSwatches />
          <Typography.Span size="heading5" content="Scope the Kreataverse" />
        </div>
      </Link>
    </div>
  );
}
