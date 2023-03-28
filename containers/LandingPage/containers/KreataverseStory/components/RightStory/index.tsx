import cx from "classnames";

import WithAspectRatio from "../../../../../../components/WithAspectRatio";
import spaceshipPng from "../../image/spaceship.png";

import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function RightStory({ className, style }: Props) {
  return (
    <div
      className={cx(styles.spaceshipImageContainer, className)}
      style={style}
    >
      <WithAspectRatio aspectRatio={674 / 510}>
        <ImageView
          className={styles.spaceshipImage}
          src={spaceshipPng.src}
          crop={{ x: 0, y: 0, w: 1, h: 1 }}
        />
      </WithAspectRatio>
    </div>
  );
}
