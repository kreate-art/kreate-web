import cx from "classnames";
import Image from "next/image";

import figure1 from "./images/right-story-1.png";
import figure2 from "./images/right-story-2.png";
import figure3 from "./images/right-story-3.png";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function RightStory$1({ className, style }: Props) {
  return (
    <div className={cx(styles.figureContainer, className)} style={style}>
      <Image className={styles.figure} src={figure1} alt="spaceship" />
    </div>
  );
}

export function RightStory$2({ className, style }: Props) {
  return (
    <div className={cx(styles.figureContainer, className)} style={style}>
      <Image className={styles.figure} src={figure2} alt="spaceship" />
    </div>
  );
}

export function RightStory$3({ className, style }: Props) {
  return (
    <div className={cx(styles.figureContainer, className)} style={style}>
      <Image className={styles.figure} src={figure3} alt="spaceship" />
    </div>
  );
}
