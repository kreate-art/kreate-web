import * as React from "react";

export enum Method {
  UsePaddingBottom,
  UsePaddingRight,
}

type Props = {
  className?: string;
  children?: React.ReactNode;
  aspectRatio: number;
  method?: Method;
};

/**
 * Wraps content in a div with width/height=aspectRatio.
 */
export default function WithAspectRatio({
  className,
  children,
  aspectRatio,
  method = Method.UsePaddingBottom,
}: Props) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <div
        style={
          method === Method.UsePaddingRight
            ? { paddingRight: `${100 * aspectRatio}%` }
            : { paddingBottom: `${100 / aspectRatio}%` }
        }
      >
        <div style={{ position: "absolute", inset: "0" }}>{children}</div>
      </div>
    </div>
  );
}
