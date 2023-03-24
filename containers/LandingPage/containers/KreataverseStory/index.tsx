import cx from "classnames";
import Image from "next/image";

import rocketPng from "../image/rocket.png";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function KreataverseStory({ className, style }: Props) {
  return (
    <div className={cx(styles.main, className)} style={style}>
      <div className={styles.rocketImageContainer}>
        <Image src={rocketPng} alt="rocket" className={styles.rocketImage} />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.storyContainer}>
          <div className={styles.story}>
            <Typography.Span
              content={<i>The year is 2039.</i>}
              color="white"
              fontWeight="bold"
            />
            <Typography.Span color="white">
              Earth is ruled by AI that writes, illustrates, and composes
              everything in the world. The joy of creation is dead and delegated
              to machine servants. All of <i>life</i> is experienced and sensed
              <i> for</i> you.
            </Typography.Span>
            <Typography.Span
              content={
                <span>
                  Tired of living as <i>numb</i> consumers, a group calling
                  themselves
                  <span
                    style={{
                      color: "#EC5929",
                      fontWeight: "700",
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    Kreators{" "}
                  </span>
                  leave the planet. Hopping from star to star and galaxy to
                  galaxy, they find a pristine realm they call the
                  “Kreataverse”. Soon, {`they'll`} call it “Home”.
                </span>
              }
              color="white"
            />
          </div>
          <div className={styles.story}>
            <Typography.Span
              content={
                <span>
                  <i>
                    Kreators&apos; Log 1:{" "}
                    <span
                      style={{
                        color: "#EC5929",
                        fontWeight: "700",
                      }}
                    >
                      Kolours
                    </span>
                  </i>
                </span>
              }
              color="white"
              fontWeight="semibold"
            />
            <Typography.Span
              content="Landing on their first planet, the Kreators are infected by an alien virus that renders them kolourblind. After weeks of research, the explorers finally find a cure: a single herb in that strange world, which restores the perception of one kolour at a time. Recovery is slow but steady."
              color="white"
            />
            <Typography.Span
              content="What's Next?"
              color="white"
              fontWeight="bold"
            />
            <Typography.Span
              content="The Kreataverse is free for you to make your own. Find your place in this new world, restore all the kolours of kreation, and start kreating!"
              color="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
