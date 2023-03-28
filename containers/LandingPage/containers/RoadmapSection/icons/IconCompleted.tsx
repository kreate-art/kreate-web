import { SVGProps } from "react";

export default function IconCompleted(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect y="0.5" width="24" height="24" rx="12" fill="#00A167" />
      <path
        d="M8 12.5003L10.8284 15.3287L16.4853 9.67188"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
