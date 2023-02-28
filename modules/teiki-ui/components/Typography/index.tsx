/**
 * @experimental
 */
import cx from "classnames";

import styles from "./index.module.scss";

const SIZE_TO_CLASS_NAME = {
  heading1: styles.sizeHeading1,
  heading2: styles.sizeHeading2,
  heading3: styles.sizeHeading3,
  heading4: styles.sizeHeading4,
  heading5: styles.sizeHeading5,
  heading6: styles.sizeHeading6,
  body: styles.sizeBody,
  bodySmall: styles.sizeBodySmall,
  bodyExtraSmall: styles.sizeBodyExtraSmall,
  none: "",
};

const LINE_HEIGHT_TO_CLASS_NAME = {
  large: styles.lineHeightLarge,
  medium: styles.lineHeightMedium,
  small: styles.lineHeightSmall,
  none: "",
};

const COLOR_TO_CLASS_NAME = {
  ink: styles.colorInk,
  ink80: styles.colorInk80,
  ink50: styles.colorInk50,
  ink30: styles.colorInk30,
  ink10: styles.colorInk10,
  orange: styles.colorOrange,
  orange80: styles.colorOrange80,
  orange50: styles.colorOrange50,
  orange30: styles.colorOrange30,
  orange10: styles.colorOrange10,
  green: styles.colorGreen,
  white: styles.colorWhite,
  red: styles.colorRed,
  none: "",
};

const FONT_WEIGHT_TO_CLASS_NAME = {
  regular: styles.fontWeightRegular,
  semibold: styles.fontWeightSemibold,
  bold: styles.fontWeightBold,
  black: styles.fontWeightBlack,
  none: "",
};

const MAX_LINES_TO_CLASS_NAME = {
  [1]: styles.maxLines1,
  [2]: styles.maxLines2,
  [3]: styles.maxLines3,
  [4]: styles.maxLines4,
  [5]: styles.maxLines5,
  none: "",
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode;
  children?: React.ReactNode;
  size?: keyof typeof SIZE_TO_CLASS_NAME;
  lineHeight?: keyof typeof LINE_HEIGHT_TO_CLASS_NAME;
  color?: keyof typeof COLOR_TO_CLASS_NAME;
  fontWeight?: keyof typeof FONT_WEIGHT_TO_CLASS_NAME;
  maxLines?: keyof typeof MAX_LINES_TO_CLASS_NAME;
} & React.HTMLAttributes<HTMLElement>;

function Div({
  className,
  style,
  content,
  children = content,
  size = "body",
  lineHeight = "none",
  color = "ink",
  fontWeight = "none",
  maxLines = "none",
  ...others
}: Props) {
  return (
    <div className={cx(className, styles.container)} style={style} {...others}>
      <div
        className={cx(
          SIZE_TO_CLASS_NAME[size],
          LINE_HEIGHT_TO_CLASS_NAME[lineHeight],
          COLOR_TO_CLASS_NAME[color],
          FONT_WEIGHT_TO_CLASS_NAME[fontWeight],
          MAX_LINES_TO_CLASS_NAME[maxLines]
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Span({
  className,
  style,
  content,
  children = content,
  size = "none",
  lineHeight = "none",
  color = "none",
  fontWeight = "none",
  ...others
}: Omit<Props, "maxLines">) {
  return (
    <span
      className={cx(
        className,
        styles.container,
        SIZE_TO_CLASS_NAME[size],
        LINE_HEIGHT_TO_CLASS_NAME[lineHeight],
        COLOR_TO_CLASS_NAME[color],
        FONT_WEIGHT_TO_CLASS_NAME[fontWeight]
      )}
      style={style}
      {...others}
    >
      {children}
    </span>
  );
}

const Typography = {
  Div,
  Span,
};

export default Typography;
