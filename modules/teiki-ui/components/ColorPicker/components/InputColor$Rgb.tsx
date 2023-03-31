import styles from "../index.module.scss";
import { Color, RGB } from "../types";
import { rgbToHex, hexToRgb } from "../utils";

import InputColor$Base from "./InputColor$Base";

type Props = {
  value: Color;
  onChange?: (c: Color) => void;
};

function toText(rgb: RGB) {
  return rgb.join(", ");
}

function fromText(value: string): RGB | undefined {
  const channels = value.split(",").map((i) => parseInt(i.trim()));
  return channels.length === 3 &&
    channels.every((i) => !isNaN(i) && i >= 0 && i <= 255)
    ? (channels as RGB)
    : undefined;
}

export default function InputColor$Rgb({ value, onChange }: Props) {
  return (
    <InputColor$Base
      value={hexToRgb(value)}
      fromText={fromText}
      toText={toText}
      onChange={(rgb) => onChange?.(rgbToHex(rgb))}
      label="RGB"
      className={styles.rgbColorInput}
    />
  );
}
