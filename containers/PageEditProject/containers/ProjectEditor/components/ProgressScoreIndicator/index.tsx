import * as React from "react";

import { ProgressScore } from "../../../../types";

import { getPathCommandForClipPath } from "./utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProgressScore;
};

export function ProgressScoreIndicator({ className, style, value }: Props) {
  const id = React.useId(); // avoid id collision
  value = Math.max(0.0, Math.min(1.0, value)); // defensive coding

  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 26 26"
      width="26"
      height="26"
    >
      {/* The white background */}
      <circle cx="13" cy="13" r="13" fill="#fff" />

      {/* The gray circle border */}
      <circle cx="13" cy="13" r="12" stroke="#0000001A" strokeWidth="2" />

      {/* The green arc */}
      <g clipPath={`url(#${id})`}>
        <circle cx="13" cy="13" r="12" stroke="#008241" strokeWidth="2" />
      </g>

      {/* The gray/green check icon */}
      <path
        fill={value > 1.0 - 1e-9 ? "#008241" : "#0000004D"}
        d="m11 15.78-2.3133-2.3133a.664.664 0 0 0-.94 0c-.26.26-.26.68 0 .94l2.7866 2.7866c.26.26.68.26.94 0l7.0534-7.0533c.26-.26.26-.68 0-.94a.664.664 0 0 0-.94 0L11 15.78Z"
      />

      {/* The clip path for the green arc */}
      <defs>
        <clipPath id={`${id}`}>
          <path d={getPathCommandForClipPath([0, 0, 26, 26], value)} />
        </clipPath>
      </defs>
    </svg>
  );
}
