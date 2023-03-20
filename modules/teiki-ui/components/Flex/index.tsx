import * as React from "react";

type FlexKeys =
  | "alignContent"
  | "alignItems"
  | "alignSelf"
  | "alignTracks"
  | "columnGap"
  | "display"
  | "flex"
  | "flexBasis"
  | "flexDirection"
  | "flexFlow"
  | "flexGrow"
  | "flexShrink"
  | "flexWrap"
  | "gap"
  | "justifyContent"
  | "justifyItems"
  | "justifySelf"
  | "justifyTracks"
  | "maxHeight"
  | "maxWidth"
  | "minHeight"
  | "minWidth"
  | "padding"
  | "paddingBlock"
  | "paddingBlockEnd"
  | "paddingBlockStart"
  | "paddingBottom"
  | "paddingInline"
  | "paddingInlineEnd"
  | "paddingInlineStart"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "rowGap";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Pick<React.CSSProperties, FlexKeys>;

function Base({ className, style, children, ...others }: Props) {
  return (
    <div className={className} style={{ ...others, ...style }}>
      {children}
    </div>
  );
}

function Row(props: Props) {
  return <Base display="flex" flexDirection="row" {...props} />;
}

function Col(props: Props) {
  return <Base display="flex" flexDirection="column" {...props} />;
}

function Cell(props: Props) {
  return <Base {...props} />;
}

const Flex = { Row, Col, Cell };

export default Flex;
