import { RGB, HSL, CMYK, Color } from "./types";

export function randomHexColor(amount: number): Color[] {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(`${randomHex()}${randomHex()}${randomHex()}`);
  }

  return result;
}

export function clamp(number: number, min = 0, max = 1): number {
  return Math.min(Math.max(number, min), max);
}

// Hue measured in degrees of the color circle ranging from 0 to 360
export function changeColorHueValue(color: Color, hue: number): Color {
  const hsl = rgbToHsl(hexToRgb(color));
  hsl[0] = hue;
  return (
    "#" +
    hslToRgb(hsl)
      .map((i) => toColorHex(Math.round(i)))
      .join("")
  );
}

function randomHex() {
  return toColorHex(Math.floor(Math.random() * 256));
}

function toColorHex(value: number): Color {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

// Color conversion utilities
// Cloned from https://github.com/Qix-/color-convert/blob/master/conversions.js

/**
 * Return `null` if hex values can not parse to a valid color
 */
export function hexToRgb(color: Color): RGB {
  const parts = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/.exec(color) ?? [];

  return parts.slice(1, 4).map((hex) => parseInt(hex, 16)) as RGB;
}

export function rgbToHsl(rgb: number[]): HSL {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
}

/**
 * Return `null` if rgb values can not parse to a valid color
 */
export function rgbToHex(rgb: RGB): Color {
  return (
    "#" +
    rgb
      .map((i) => toColorHex(Math.round(i)))
      .join("")
      .toUpperCase()
  );
}

export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return [c * 100, m * 100, y * 100, k * 100];
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;

  const rgb: RGB = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1);
    if (t3 < 0) {
      t3++;
    }

    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
}

export function cmykToRgb(cmyk: CMYK): RGB {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;

  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  return [r * 255, g * 255, b * 255];
}
