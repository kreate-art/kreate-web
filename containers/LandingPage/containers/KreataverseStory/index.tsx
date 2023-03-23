import cx from "classnames";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import rocketPng from "../image/rocket.png";

import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// TODO: Come back & refine as design!!!
export default function KreataverseStory({ className, style }: Props) {
  return (
    <div className={cx(styles.main, className)} style={style}>
      <div className={styles.coverImageContainer}>
        <WithAspectRatio aspectRatio={654 / 897}>
          <ImageView
            className={styles.imageView}
            src={rocketPng.src}
            crop={{ x: 0, y: 0, w: 1, h: 1 }}
          />
        </WithAspectRatio>
      </div>
      <div className={styles.storyContainer}>
        <div className={styles.story}>
          <Typography.Span
            content="The year is 2039."
            color="white"
            fontWeight="bold"
            style={{ fontStyle: "italic" }}
          />
          <Typography.Span
            content="Earth is ruled by AI that writes, illustrates, and composes everything in the world. The joy of creation is dead and delegated to machine servants. All of life is experienced and sensed for you."
            color="white"
          />
          <Typography.Span
            content={
              <span>
                Tired of living as numb consumers, a group calling themselves
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
                galaxy, they find a pristine realm they call the “Kreataverse”.
                Soon, {`they'll`} call it “Home”.
              </span>
            }
            color="white"
          />
        </div>
        <div className={styles.story}>
          <Typography.Span
            content={
              <span>
                {`Kreators'`} Log 1:
                <span
                  style={{
                    color: "#EC5929",
                    fontWeight: "700",
                    fontStyle: "italic",
                  }}
                >
                  {" "}
                  Kolours{" "}
                </span>
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
  );
}
