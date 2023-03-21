import cx from "classnames";
import * as React from "react";

import { DEFAULT_IMAGE_URL } from "../../../../../../containers/PageHome/components/ProjectImageCropped/constants";

import styles from "./index.module.scss";

import { range } from "@/modules/array-utils";
import ImageView from "@/modules/teiki-components/components/ImageView";

const DEFAULT_INTERVAL = 8000;

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
              ) : (
                <ImageView
                  style={{ width: "100%", height: "100%" }}
                  src={DEFAULT_IMAGE_URL}
                  crop={{ x: 0, y: 0, w: 1, h: 1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
