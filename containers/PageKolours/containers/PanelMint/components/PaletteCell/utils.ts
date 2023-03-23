import { Kolours } from "@/modules/kolours/types";

type Ratio = number;

// https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
export function getPerceivedLuminance(kolour: Kolours.Kolour): number {
  const matched = /^([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/.exec(
    kolour
  );
  if (!matched) return NaN;
  const rr: Ratio = parseInt(matched[1], 16) / 255;
  const gg: Ratio = parseInt(matched[2], 16) / 255;
  const bb: Ratio = parseInt(matched[3], 16) / 255;
  return Math.sqrt(0.299 * rr * rr + 0.587 * gg * gg + 0.114 * bb * bb);
}
