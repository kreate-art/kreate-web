import { Kolours } from "@/modules/kolours/types";

export function toHexColor(kolour: Kolours.Kolour) {
  return "#" + kolour;
}
