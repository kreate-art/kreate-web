import { SVGProps } from "react";

export default function Callout(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="649"
      height="227"
      viewBox="0 0 649 227"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="64"
        y="83"
        style={{ fontSize: "52px", fill: "#EC5929", fontWeight: "900" }}
      >
        IT&apos;S FUN
      </text>
      <text
        x="288"
        y="83"
        style={{ fontSize: "52px", fill: "#222", fontWeight: "900" }}
      >
        TO
      </text>
      <text
        x="64"
        y="153"
        style={{ fontSize: "52px", fill: "#222", fontWeight: "900" }}
      >
        BECOME A
      </text>
      <text
        x="352"
        y="153"
        style={{ fontSize: "52px", fill: "#EC5929", fontWeight: "900" }}
      >
        KREATOR
      </text>
      <path
        opacity="0.1"
        d="M4.76065e-05 16C2.13142e-05 7.16347 7.16347 0 16 0H633C641.837 0 649 7.16342 649 16L649 178.868C649.001 187.704 641.837 194.868 633 194.868H45.9198L0.000579809 227L22.4497 194.868H16.0005C7.164 194.868 0.000558495 187.704 0.000532203 178.868L4.76065e-05 16Z"
        fill="#EC5929"
      />
    </svg>
  );
}
