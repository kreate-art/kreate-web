import styles from "../index.module.scss";
import { Color, CMYK } from "../types";
import { rgbToHex, hexToRgb, rgbToCmyk, cmykToRgb } from "../utils";

import InputColor$Base from "./InputColor$Base";

type Props = {
  value: Color;
  onChange?: (c: Color) => void;
};

function fromText(value: string): CMYK | undefined {
  const channels = value
    .split(",")
    .map((i) => i.trim())
    .map((i) => (/^(\d{1,3}|\d{1,3}%)$/.test(i) ? parseInt(i) : null));

  return channels.length === 4 &&
    channels.every((i) => i !== null && !isNaN(i) && i >= 0 && i <= 100)
    ? (channels as CMYK)
    : undefined;
}

function toText(value: CMYK): string {
  return value.map((i) => `${Math.round(i)}%`).join(", ");
}

export default function InputColor$Cmyk({ value, onChange }: Props) {
  return (
    <InputColor$Base
      value={rgbToCmyk(hexToRgb(value))}
      fromText={fromText}
      toText={toText}
      onChange={(cmyk) => {
        const color = rgbToHex(cmykToRgb(cmyk));
        onChange?.(color);
      }}
      label="CMYK"
      className={styles.cmykColorInput}
    />
  );
}
