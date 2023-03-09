/**
 * @experimental
 */
import cx from "classnames";

import styles from "./index.module.scss";

const AS_TO_CLASS_NAME = {
  div: "",
  span: "",
  h1: styles.asH1,
  h2: styles.asH2,
  h3: styles.asH3,
  h4: styles.asH4,
  h5: styles.asH5,
  h6: styles.asH6,
};

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
  as?: keyof typeof AS_TO_CLASS_NAME;
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
  as = "div",
  content,
  children = content,
  size = "body",
  lineHeight = "none",
  color = "ink",
  fontWeight = "none",
  maxLines = "none",
  ...others
}: Props) {
  const Component = as;
  return (
    <div className={cx(className, styles.container)} style={style} {...others}>
      <Component
        className={cx(
          AS_TO_CLASS_NAME[as],
          SIZE_TO_CLASS_NAME[size],
          LINE_HEIGHT_TO_CLASS_NAME[lineHeight],
          COLOR_TO_CLASS_NAME[color],
          FONT_WEIGHT_TO_CLASS_NAME[fontWeight],
          MAX_LINES_TO_CLASS_NAME[maxLines]
        )}
      >
        {children}
      </Component>
    </div>
  );
}

function Span({
  className,
  style,
  as = "span",
  content,
  children = content,
  size = "none",
  lineHeight = "none",
  color = "none",
  fontWeight = "none",
  ...others
}: Omit<Props, "maxLines">) {
  const Component = as;
  return (
    <Component
      className={cx(
        className,
        styles.container,
        AS_TO_CLASS_NAME[as],
        SIZE_TO_CLASS_NAME[size],
        LINE_HEIGHT_TO_CLASS_NAME[lineHeight],
        COLOR_TO_CLASS_NAME[color],
        FONT_WEIGHT_TO_CLASS_NAME[fontWeight]
      )}
      style={style}
      {...others}
    >
      {children}
    </Component>
  );
}

function H1(props: Props) {
  return <Div as="h1" {...props} />;
}

function H2(props: Props) {
  return <Div as="h2" {...props} />;
}

function H3(props: Props) {
  return <Div as="h3" {...props} />;
}

function H4(props: Props) {
  return <Div as="h4" {...props} />;
}

function H5(props: Props) {
  return <Div as="h5" {...props} />;
}

function H6(props: Props) {
  return <Div as="h6" {...props} />;
}

const Typography = {
  Div,
  Span,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
};

export default Typography;
