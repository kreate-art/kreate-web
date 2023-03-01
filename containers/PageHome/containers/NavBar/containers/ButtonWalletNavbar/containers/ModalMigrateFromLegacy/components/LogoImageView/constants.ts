import { ProjectImage } from "@/modules/business-types";

export const DEFAULT_LOGO_IMAGE: ProjectImage = {
  url: `data:image/svg+xml,
    <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='a' patternUnits='userSpaceOnUse' width='80' height='20'
          patternTransform='scale(0.4) rotate(65)'>
          <rect x='0' y='0' width='100%' height='100%' fill='hsla(280,2.6%,77.1%,1)' />
          <path
            d='M-20.133 4.568C-13.178 4.932-6.452 7.376 0 10c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'
            stroke-width='3' stroke='hsla(235, 19%, 87%, 1)' fill='none' />
        </pattern>
      </defs>
      <rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)' />
    </svg>`.replace(/\s/g, " "),
  crop: { x: 0, y: 0, w: 1, h: 1 },
};
