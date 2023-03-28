import cx from "classnames";
import { Carousel } from "react-responsive-carousel";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function LeftStory({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Carousel
        showStatus={false}
        showArrows={false}
        className={styles.carousel}
      >
        <div className={styles.story}>
          <Typography.Span
            content={"The year is 2039."}
            color="white"
            fontWeight="bold"
          />
          <Typography.Span color="white50">
            Earth is ruled by AI that writes, illustrates, and composes
            everything in the world. The joy of creation is dead and delegated
            to machine servants. All of life is experienced and sensed for you.
          </Typography.Span>
          <Typography.Span
            content={
              <span>
                Tired of living as numb consumers, a group calling themselves
                Kreators leave the planet. Hopping from star to star and galaxy
                to galaxy, they find a pristine realm they call the
                “Kreataverse”. Soon, {`they'll`} call it “Home”.
              </span>
            }
            color="white50"
          />
        </div>
        <div className={styles.story}>
          <Typography.Span
            content={<span>Kreators&apos; Log 1: Kolours</span>}
            color="white"
            fontWeight="bold"
          />
          <Typography.Span
            content="Landing on their first planet, the Kreators are infected by an alien virus that renders them kolourblind. After weeks of research, the explorers finally find a cure: a single herb in that strange world, which restores the perception of one kolour at a time. Recovery is slow but steady."
            color="white50"
          />
        </div>
        <div className={styles.story}>
          <Typography.Span
            content="What's Next?"
            color="white"
            fontWeight="bold"
          />
          <Typography.Span
            content="The Kreataverse is free for you to make your own. Find your place in this new world, restore all the kolours of kreation, and start kreating!"
            color="white50"
          />
        </div>
      </Carousel>
    </div>
  );
}
