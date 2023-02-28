import cx from "classnames";
import * as React from "react";

import Viewer from "./components/Viewer";
import IconChevronLeft from "./icons/IconChevronLeft";
import IconChevronRight from "./icons/IconChevronRight";
import styles from "./index.module.scss";
import { toArrayOfReactNode } from "./utils";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";

const GAP_TO_GAP_WIDTH = {
  none: 0,
  thin: 10,
  medium: 20,
  thick: 40,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  gap?: keyof typeof GAP_TO_GAP_WIDTH;
  maxItemWidth?: number;
};

export default function Carousel({
  className,
  style,
  children,
  gap,
  maxItemWidth,
}: Props) {
  const items: React.ReactNode[] = toArrayOfReactNode(children);
  const [fromIndex, setFromIndex] = React.useState(0);

  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);

  const containerSize = useElementSize(containerElement);
  const numVisibleItems =
    maxItemWidth && containerSize
      ? Math.ceil(containerSize.w / maxItemWidth)
      : 1;

  const gapWidth = gap ? GAP_TO_GAP_WIDTH[gap] : undefined;
  const fromIndex$PrevValue =
    fromIndex > 0 ? fromIndex - 1 : items.length - numVisibleItems;
  const fromIndex$NextValue =
    fromIndex === items.length - numVisibleItems ? 0 : fromIndex + 1;
  return (
    <div
      ref={setContainerElement}
      className={cx(styles.container, className)}
      style={style}
    >
      <Viewer
        className={styles.viewer}
        items={items}
        fromIndex={fromIndex}
        numVisibleItems={numVisibleItems}
        gapWidth={gapWidth}
      />
      {items.length > numVisibleItems ? (
        <>
          <div className={styles.buttonPrevContainer}>
            <button
              className={styles.buttonScrollProjects}
              onClick={() => setFromIndex(fromIndex$PrevValue)}
            >
              <IconChevronLeft />
            </button>
          </div>
          <div className={styles.buttonNextContainer}>
            <button
              className={styles.buttonScrollProjects}
              onClick={() => setFromIndex(fromIndex$NextValue)}
            >
              <IconChevronRight />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
