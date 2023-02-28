import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { range } from "@/modules/array-utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  items: React.ReactNode[];
  fromIndex: number;
  numVisibleItems: number;
  gapWidth?: number;
};

/**
 * Displays items having indexes from L to R.
 * Smoothly scroll when L or R changes.
 */
export default function Viewer({
  className,
  style,
  items,
  fromIndex,
  numVisibleItems,
  gapWidth,
}: Props) {
  const numBoxes = items.length + numVisibleItems;
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div
        className={styles.contentWrapper}
        style={gapWidth ? { margin: `${-gapWidth / 2}px` } : undefined}
      >
        <div
          className={styles.content}
          style={{
            minWidth: `${(100 / numVisibleItems) * numBoxes}%`,
            maxWidth: `${(100 / numVisibleItems) * numBoxes}%`,
            transform: `translateX(-${(100 / numBoxes) * fromIndex}%)`,
          }}
        >
          {range(numBoxes).map((index) => (
            <div
              key={index}
              className={styles.itemBox}
              style={gapWidth ? { padding: `${gapWidth / 2}px` } : undefined}
            >
              {items[index]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
