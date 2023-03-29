import { Color } from "./index";

export type ColorSubComponent = "R" | "G" | "B";
export type RGB = [number, number, number];

/**
 * Return `null` if hex values can not parse to a valid color
 */
export function hexToRgb(color: Color) {
  const parts =
    /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/.exec(color) ?? [];

  return parts.slice(1, 4).map((hex) => parseInt(hex, 16));
}

/**
 * Return `null` if rgb values can not parse to a valid color
 */
export function rgbToHex(rgb: string[]): Color | null {
  if (rgb.length !== 3) return null;
  const numbers = rgb.map((i) => (i.match(/^\d{1,3}$/) ? parseInt(i) : NaN));
  if (numbers.some((i) => isNaN(i) || i > 255 || i < 0)) return null;
  else return numbers.map((i) => safeToColorHex(i)).join("");
}

export function randomHexColor(amount: number): Color[] {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(`${randomHex()}${randomHex()}${randomHex()}`);
  }

  return result;
}

function randomHex() {
  // Math.random upperbound is exclusive, so we have to add 1
  return safeToColorHex(Math.floor(Math.random() * 256));
}

function safeToColorHex(value: number): Color {
  return value.toString(16).padStart(2, "0").toUpperCase();
}
