import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { range } from "@/modules/array-utils";
import ImageView from "@/modules/teiki-components/components/ImageView";

const DEFAULT_INTERVAL = 8000;

const DEFAULT_IMAGE_URL = `data:image/svg+xml,
<svg width='1920' height='1080' viewBox='0 0 1920 1080' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <rect width='1920' height='1080' fill='%232C2C2C'/>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M886 488.667C886 480.566 892.626 474 900.8 474H1019.2C1027.37 474 1034 480.566 1034 488.667V583.932C1034 583.974 1034 584.017 1034 584.059V591.333C1034 599.434 1027.37 606 1019.2 606H900.8C892.626 606 886 599.434 886 591.333V576.708C886 576.678 886 576.649 886 576.619V488.667ZM900.8 579.379V591.333H1019.2V586.572L996.386 558.312L985.762 568.841C979.608 574.939 969.499 574.485 963.928 567.859L937.72 536.694L900.8 579.379ZM1019.2 563.094L1007.94 549.15C1002.43 542.324 992.158 541.76 985.921 547.941L975.297 558.47L949.09 527.304C943.226 520.331 932.444 520.257 926.483 527.149L900.8 556.843V488.667H1019.2V563.094ZM967.4 518C967.4 509.9 974.026 503.333 982.2 503.333C990.374 503.333 997 509.9 997 518C997 526.1 990.374 532.667 982.2 532.667C974.026 532.667 967.4 526.1 967.4 518Z' fill='white' fill-opacity='0.3'/>
</svg>`.replace(/\s/g, " ");

type Ratio = number; // 0.0 .. 1.0

type RelativeRect = { x: Ratio; y: Ratio; w: Ratio; h: Ratio };

type Media = {
  type: "image";
  src: string;
  crop: RelativeRect;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  fill: true;
  items: Media[];
  interval?: number; // num milliseconds before moving to the next page
};

export default function BannerCarousel({
  className,
  style,
  items,
  interval = DEFAULT_INTERVAL,
}: Props) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentIndex((currentIndex) =>
        items.length ? (currentIndex + 1) % items.length : 0
      );
    }, interval);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, interval, items.length]);

  const numBoxes = items.length + 1;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.window}>
        <div
          className={styles.windowContent}
          style={{
            minWidth: `${numBoxes * 100}%`,
            maxWidth: `${numBoxes * 100}%`,
            height: "100%",
            transform: `translateX(${(-currentIndex / numBoxes) * 100}%)`,
          }}
        >
          {range(numBoxes).map((index) => (
            <div className={styles.windowContentItemBox} key={index}>
              {items[index] ? (
                <ImageView
                  style={{ width: "100%", height: "100%" }}
                  src={items[index].src}
                  crop={items[index].crop}
                />
              ) : !index ? (
                <ImageView
                  style={{ width: "100%", height: "100%" }}
                  src={DEFAULT_IMAGE_URL}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
