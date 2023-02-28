import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

const FONT_WEIGHT_TO_CLASS_NAME = {
  regular: styles.fontRegular,
  semibold: styles.fontSemibold,
  bold: styles.fontBold,
  black: styles.fontBlack,
  default: "",
};

const SIZE_TO_CLASS_NAME = {
  h1: styles.sizeH1,
  h2: styles.sizeH2,
  h3: styles.sizeH3,
  h4: styles.sizeH4,
  h5: styles.sizeH5,
  h6: styles.sizeH6,
};

const COLOR_TO_CLASS_NAME = {
  ink: styles.colorInk100,
  ink100: styles.colorInk100,
  green: styles.colorGreen100,
  green100: styles.colorGreen100,
  white: styles.colorWhite100,
  white100: styles.colorWhite100,
  white80: styles.colorWhite80,
  red: styles.colorRed100,
  red100: styles.colorRed100,
};

const MAX_LINES_TO_CLASS_NAME = {
  "1": styles.max1Lines,
  "2": styles.max2Lines,
  "3": styles.max3Lines,
  "4": styles.max4Lines,
  "5": styles.max5Lines,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  size?: keyof typeof SIZE_TO_CLASS_NAME;
  color?: keyof typeof COLOR_TO_CLASS_NAME;
  fontWeight?: keyof typeof FONT_WEIGHT_TO_CLASS_NAME;
  maxLines?: "1" | "2" | "3" | "4" | "5" | 1 | 2 | 3 | 4 | 5 | undefined;
} & React.HTMLAttributes<HTMLElement>;

export default function Title({
  className,
  style,
  content,
  children,
  size = "h6",
  color = "ink",
  fontWeight = "default",
  maxLines,
  ...others
}: Props) {
  const displayedContent = children || content;
  return (
    <div
      className={cx(
        styles.container,
        className,
        SIZE_TO_CLASS_NAME[size],
        COLOR_TO_CLASS_NAME[color],
        FONT_WEIGHT_TO_CLASS_NAME[fontWeight],
        maxLines ? MAX_LINES_TO_CLASS_NAME[maxLines] : null
      )}
      style={style}
      {...others}
    >
      {displayedContent}
    </div>
  );
}
