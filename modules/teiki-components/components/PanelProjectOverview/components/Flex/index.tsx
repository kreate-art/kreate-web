import * as React from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & React.CSSProperties;

/** @experimental */
function Base({ className, style, children, ...others }: Props) {
  return (
    <div className={className} style={{ ...others, ...style }}>
      {children}
    </div>
  );
}

/** @experimental */
function Row(props: Props) {
  return <Base display="flex" flexDirection="row" {...props} />;
}

/** @experimental */
function Col(props: Props) {
  return <Base display="flex" flexDirection="column" {...props} />;
}

/** @experimental */
function Cell(props: Props) {
  return <Base {...props} />;
}

const Flex = { Row, Col, Cell };

export default Flex;
