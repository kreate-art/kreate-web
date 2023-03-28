import { SVGProps } from "react";

export default function IconUncompleted(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="13" y="13" width="6" height="6" rx="3" fill="white" />
    </svg>
  );
}
