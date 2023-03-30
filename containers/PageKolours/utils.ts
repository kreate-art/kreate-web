import { Kolours } from "@/modules/kolours/types";

export function toHexColor(kolour: Kolours.Kolour) {
  return "#" + kolour;
}

export function fromHexColor(color: string): Kolours.Kolour | undefined {
  color = color.toUpperCase();
  const matched = /^#[0-9A-F]{6}$/.test(color);
  if (!matched) return undefined;
  return color.slice(1);
}
