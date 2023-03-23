import cx from "classnames";
import Link from "next/link";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import IconSwatches from "../NftCollection/components/IconSwatches";

import stepFour from "./images/step-four.png";
import stepOne from "./images/step-one.png";
import stepThree from "./images/step-three.png";
import stepTwo from "./images/step-two.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
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
      <Flex.Row className={styles.row} style={style}>
        <Flex.Col className={cx(styles.topLeftColumn, styles.leftColumn)}>
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
        <Flex.Col className={cx(styles.topRightColumn, styles.rightColumn)}>
          <div className={styles.stepOneContainer}>
            <WithAspectRatio aspectRatio={552 / 252}>
              <ImageView
                className={styles.imageView}
                src={stepOne.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
      </Flex.Row>

      {/* Step 2 */}
      <Flex.Row className={styles.row}>
        <Flex.Col className={styles.leftColumn}>
          <div className={styles.stepOneTextContainer}>
            <Typography.Span
              content="Step 2:"
              color="white"
              className={styles.step}
            />
            <Typography.Span
              content={
                <span>
                  Scope out the Kreataverse for a piece of
                  <span style={{ color: "orange" }}> Genesis Kreation </span>
                </span>
              }
              color="white"
              className={styles.action}
            />
          </div>
        </Flex.Col>
        <Divider.Vertical color="white-10" />
        <Flex.Col className={styles.rightColumn}>
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
      <Flex.Row className={styles.row}>
        <Flex.Col className={styles.leftColumn}>
          <div className={styles.stepOneTextContainer}>
            <Typography.Span
              content="Step 3:"
              color="white"
              className={styles.step}
            />
            <Typography.Span
              content={
                <span>
                  Mint its <span style={{ color: "#EC5929" }}> Kolours </span>{" "}
                  <br></br>
                  to restore its Kolourway
                </span>
              }
              color="white"
              className={styles.action}
            />
          </div>
        </Flex.Col>
        <Divider.Vertical color="white-10" />
        <Flex.Col className={styles.rightColumn}>
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
      <Flex.Row className={styles.row}>
        <Flex.Col className={styles.leftColumn}>
          <div className={styles.stepOneTextContainer}>
            <Typography.Span
              content="Step 4:"
              color="white"
              className={styles.step}
            />
            <Typography.Span
              content={
                <span>
                  Mint your piece of <br></br>
                  <span style={{ color: "#EC5929" }}> Genesis Kreation </span>
                </span>
              }
              color="white"
              className={styles.action}
            />
          </div>
        </Flex.Col>
        <Divider.Vertical color="white-10" />
        <Flex.Col className={styles.rightColumn}>
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
      <Flex.Row className={styles.row}>
        <Flex.Col className={cx(styles.leftColumn, styles.lastRow)}>
          <div className={styles.stepOneTextContainer}>
            <Typography.Span
              content="Step 5:"
              color="white"
              className={styles.step}
            />
            <Typography.Span
              content={<span>Enjoy the fruits of your Kreation</span>}
              color="white"
              className={styles.action}
            />
          </div>
        </Flex.Col>
        <Divider.Vertical color="white-10" />
        <Flex.Col className={cx(styles.rightColumn, styles.lastRow)}>
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
      <Link href="/kolours" className={styles.kolourButtonContainer}>
        <div className={styles.kolourButton}>
          <IconSwatches />
          <Typography.Span size="heading5" content="Scope the Kreataverse" />
        </div>
      </Link>
    </div>
  );
}
