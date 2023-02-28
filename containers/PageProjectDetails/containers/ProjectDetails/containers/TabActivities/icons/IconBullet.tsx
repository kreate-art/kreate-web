import * as React from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function IconBullet({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle cx="16" cy="16" r="6" fill="currentColor" />
    </svg>
  );
}
