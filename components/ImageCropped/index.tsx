import * as React from "react";

import ImageView from "@/modules/teiki-components/components/ImageView";

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  src: string;
  crop: Rect;
  /** Equivalent to `width: 100%; height: 100%;` */
  fluid?: boolean;
};

/** @deprecated use ImageView instead */
export default function ImageCropped({
  className,
  style,
  src,
  crop,
  fluid,
}: Props) {
  return (
    <ImageView
      className={className}
      style={fluid ? { ...style, width: "100%", height: "100%" } : style}
      src={src}
      crop={crop}
    />
  );
}
