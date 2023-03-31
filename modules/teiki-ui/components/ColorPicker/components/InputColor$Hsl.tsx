import styles from "../index.module.scss";
import { Color, HSL } from "../types";
import { rgbToHex, hexToRgb, rgbToHsl, hslToRgb } from "../utils";

import InputColor$Base from "./InputColor$Base";

type Props = {
  value: Color;
  onChange?: (c: Color) => void;
};

function fromText(value: string): HSL | undefined {
  const hsl = value.split(",").map((i) => i.trim());
  if (hsl.length === 3) {
    const [h, s, l] = hsl;
    if (
      /^(\d+|\d+°)$/.test(h) &&
      /^(\d+|\d+%)$/.test(s) &&
      /^(\d+|\d+%)$/.test(l)
    ) {
      const hValue = parseInt(h);
      const sValue = parseInt(s);
      const lValue = parseInt(l);

      return hValue >= 0 &&
        hValue <= 360 &&
        sValue >= 0 &&
        sValue <= 100 &&
        lValue >= 0 &&
        lValue <= 100
        ? [hValue, sValue, lValue]
        : undefined;
    }
  }
  return undefined;
}

function toText(hsl: HSL) {
  return `${Math.round(hsl[0])}°, ${Math.round(hsl[1])}%, ${Math.round(
    hsl[2]
  )}%`;
}

export default function InputColor$Hsl({ value, onChange }: Props) {
  return (
    <InputColor$Base
      value={rgbToHsl(hexToRgb(value))}
      fromText={fromText}
      toText={toText}
      onChange={(hsl) => {
        const color = rgbToHex(hslToRgb(hsl));
        onChange?.(color);
      }}
      label="HSL"
      className={styles.hslColorInput}
    />
  );
}
