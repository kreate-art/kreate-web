import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  marginTop?: React.CSSProperties["marginTop"];
  marginBottom?: React.CSSProperties["marginBottom"];
  containerRef?: React.Ref<HTMLDivElement>;
};

function Section$Base({
  className,
  style,
  children,
  marginTop,
  marginBottom,
  containerRef,
}: Props) {
  return (
    <div
      ref={containerRef}
      className={cx(styles.container, className)}
      style={{ marginTop, marginBottom, ...style }}
    >
      {children}
    </div>
  );
}

const Section = React.forwardRef<HTMLDivElement, Props>(function Section(
  props,
  ref
) {
  return <Section$Base containerRef={ref} {...props} />;
});

export default Section;
