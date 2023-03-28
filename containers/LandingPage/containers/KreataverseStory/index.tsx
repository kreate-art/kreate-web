import cx from "classnames";

import { LeftStory$1, LeftStory$2, LeftStory$3 } from "./components/LeftStory";
import RightStory from "./components/RightStory";
import styles from "./index.module.scss";

import Carousel from "@/modules/teiki-components/components/Carousel";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function KreataverseStory({ className, style }: Props) {
  return (
    <div id="kreataverse_story">
      <div className={styles.story}>Kreataverse Story</div>
      <div className={cx(styles.main, className)} style={style}>
        {/* TODO: Refine me!! */}
        <Carousel className={styles.carousel} indicatorPosition="bottom-left">
          <div className={styles.container}>
            <LeftStory$1 />
            <RightStory />
          </div>
          <div className={styles.container}>
            <LeftStory$2 />
            {/* As discussed with our designer, these banners should be unique */}
            <RightStory />
          </div>
          <div className={styles.container}>
            <LeftStory$3 />
            {/* As discussed with our designer, these banners should be unique */}
            <RightStory />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
