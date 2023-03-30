import { useState } from "react";

import styles from "../index.module.scss";
import { Color, RGB, CMYK, HSL } from "../types";
import {
  rgbToHex,
  rgbToCmyk,
  rgbToHsl,
  hexToRgb,
  cmykToRgb,
  hslToRgb,
} from "../utils";

import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";

type Props = {
  colorSystem: ColorSystem;
  value: string;
  onChange: (color: Color) => void;
};

type ColorSytemToType = {
  hex: Color;
  rgb: RGB;
  cmyk: CMYK;
  hsl: HSL;
};

export type ColorSystem = keyof ColorSytemToType;

interface ColorToolkit<T> {
  toHex(v: T): Color;
  fromHex(c: Color): T;
  toRawString(v: T): string;
  fromRawString(v: string): T | null;
  // Helper functions to combine conversion primitives
  fromHexToRawString(v: Color): string;
  fromRawStringToHex(v: string): Color | null;
}

function newToolkit<T>(
  methods: Omit<ColorToolkit<T>, "fromHexToRawString" | "fromRawStringToHex">
) {
  return {
    ...methods,
    fromHexToRawString(value: Color) {
      return this.toRawString(this.fromHex(value));
    },
    fromRawStringToHex(value: string) {
      const color = this.fromRawString(value);
      return color ? this.toHex(color) : null;
    },
  };
}

// We use hex color code as the only interface of this component
// Every input / output must be convert from / to hex value
// For displaying purpose, colors will be converted to raw string format
export const colorToolkits: {
  [k in keyof ColorSytemToType]: ColorToolkit<ColorSytemToType[k]>;
} = {
  hex: newToolkit({
    toHex(value: Color) {
      return value;
    },
    fromHex(value: Color) {
      return value;
    },
    toRawString(value: Color) {
      return value;
    },
    fromRawString(value: Color) {
      // Although, 3-digit shorthand for hex color is a valid format,
      // we ignore it for simplicity's sake
      return /^(#[0-9a-fA-F]{6}|[0-9a-fA-F]{6})$/.test(value) ? value : null;
    },
  }),
  rgb: newToolkit({
    toHex: rgbToHex,
    fromHex: hexToRgb,
    toRawString(rgb: RGB) {
      return rgb.join(", ");
    },
    fromRawString(value: string): RGB | null {
      const channels = value.split(",").map((i) => parseInt(i.trim()));
      return channels.length === 3 &&
        channels.every((i) => !isNaN(i) && i >= 0 && i <= 255)
        ? (channels as RGB)
        : null;
    },
  }),
  cmyk: newToolkit({
    toHex(cmyk: CMYK): Color {
      return rgbToHex(cmykToRgb(cmyk));
    },
    fromHex(value: Color): CMYK {
      return rgbToCmyk(hexToRgb(value));
    },
    fromRawString(value: string): CMYK | null {
      const channels = value
        .split(",")
        .map((i) => i.trim())
        .map((i) => (/^(\d{1,3}|\d{1,3}%)$/.test(i) ? parseInt(i) : null));

      return channels.length === 4 &&
        channels.every((i) => i !== null && !isNaN(i) && i >= 0 && i <= 100)
        ? (channels as CMYK)
        : null;
    },
    toRawString(value: CMYK): string {
      return value.map((i) => `${Math.round(i)}%`).join(", ");
    },
  }),
  hsl: newToolkit({
    toHex(hsl: HSL) {
      return rgbToHex(hslToRgb(hsl));
    },
    fromHex(color: Color) {
      return rgbToHsl(hexToRgb(color));
    },
    fromRawString(value: string): HSL | null {
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
            : null;
        }
      }
      return null;
    },
    toRawString(hsl: HSL) {
      return `${Math.round(hsl[0])}°, ${Math.round(hsl[1])}%, ${Math.round(
        hsl[2]
      )}%`;
    },
  }),
};

export default function InputColor({ colorSystem, value, onChange }: Props) {
  // We buffer dirty changes. The buffer is flush iff color input is valid
  // Otherwise, if the buffer is dirty (not null), we priotize using it over
  // value passed from props
  // When users blur from input, if the buffer is dirty, reset its value to the
  // last valid value
  const [dirtyValue, setDirtyValue] = useState<string | null>(null);

  return (
    <Flex.Col
      className={styles[`${colorSystem}ColorInput`]}
      rowGap={4}
      key={colorSystem}
    >
      <span className={styles.colorInputLabel}>
        {colorSystem.toUpperCase()}
      </span>
      <Input
        value={
          dirtyValue ?? colorToolkits[colorSystem].fromHexToRawString(value)
        }
        onChange={(newInput) => {
          const color$Parsed =
            colorToolkits[colorSystem].fromRawStringToHex(newInput);

          if (color$Parsed && color$Parsed !== value) onChange(color$Parsed);
          setDirtyValue(newInput);
        }}
        onBlur={() => dirtyValue != null && setDirtyValue(null)}
      />
    </Flex.Col>
  );
}
