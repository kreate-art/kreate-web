import cx from "classnames";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import StepFour from "../image/StepFour.png";
import StepOne from "../image/StepOne.png";
import StepThree from "../image/StepThree.png";
import StepTwo from "../image/StepTwo.png";

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
    <>
      {/* Step 1 */}
      <Flex.Row className={cx(styles.row, className)} style={style}>
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
                src={StepOne.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
      </Flex.Row>

      {/* Step 2 */}
      <Flex.Row className={cx(styles.row, className)} style={style}>
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
                src={StepTwo.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
      </Flex.Row>

      {/* Step 3 */}
      <Flex.Row className={cx(styles.row, className)} style={style}>
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
                src={StepThree.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
      </Flex.Row>

      {/* Step 4 */}
      <Flex.Row className={cx(styles.row, className)} style={style}>
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
                src={StepFour.src}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
          </div>
        </Flex.Col>
      </Flex.Row>
    </>
  );
}
