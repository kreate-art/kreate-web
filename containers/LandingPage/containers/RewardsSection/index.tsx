import cx from "classnames";

import styles from "./index.module.scss";

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
        <div className={styles.grid} style={{ gridArea: "a" }}>
          <Typography.Div size="heading2" color="orange" content="Kolour NFT" />
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
          </div>
          <div>
            <Typography.Div size="heading3" color="white" content="Royalty" />
          </div>
          <div>
            <div>Early Kreator NFT</div>
          </div>
        </div>
        <div className={styles.grid} style={{ gridArea: "b" }}>
          <Typography.Div
            size="heading2"
            color="orange"
            content="Genesis Kreation NFT"
          />
        </div>
        <div className={styles.grid} style={{ gridArea: "c" }}>
          <Typography.Div color="orange" content="Genesis Kreation NFT" />
        </div>
      </div>
    </div>
  );
}
