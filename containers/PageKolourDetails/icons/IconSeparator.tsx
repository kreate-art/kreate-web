import * as React from "react";

export default function IconSeparator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="12.5"
        y1="2"
        x2="12.5"
        y2="22"
        stroke="currentColor"
        strokeOpacity="0.1"
      />
    </svg>
  );
}
