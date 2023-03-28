import cx from "classnames";

import LeftStory from "./components/LeftStory";
import RightStory from "./components/RightStory";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function KreataverseStory({ className, style }: Props) {
  return (
    <div id="kreataverse_story">
      <div className={styles.story}>Kreataverse Story</div>
      <div className={cx(styles.main, className)} style={style}>
        <LeftStory />
        <RightStory />
      </div>
    </div>
  );
}
