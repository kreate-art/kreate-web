import cx from "classnames";
import * as React from "react";

import { LeftStory$1, LeftStory$2, LeftStory$3 } from "./components/LeftStory";
import {
  RightStory$1,
  RightStory$2,
  RightStory$3,
} from "./components/RightStory";
import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Carousel from "@/modules/teiki-components/components/Carousel";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function KreataverseStory({ className, style }: Props) {
  return (
    <div className={cx(styles.main, className)} style={style} id="kreataverse">
      <div className={styles.story}>Kreataverse Story</div>
      {/* TODO: Refine me!! */}
      <Carousel className={styles.carousel} indicatorPosition="bottom-left">
        <div className={styles.container}>
          <LeftStory$1 />
          <RightStory$1 />
        </div>
        <div className={styles.container}>
          <LeftStory$2 />
          <RightStory$2 />
        </div>
        <div className={styles.container}>
          <LeftStory$3 />
          <RightStory$3 />
        </div>
      </Carousel>
    </div>
  );
}
