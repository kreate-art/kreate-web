import styles from "../index.module.scss";
import { Color } from "../types";

import InputColor$Base from "./InputColor$Base";

type Props = {
  value: Color;
  onChange?: (c: Color) => void;
};

export default function InputColor$Hex({ value, onChange }: Props) {
  return (
    <InputColor$Base<Color>
      value={value}
      fromText={(value) => {
        // Although, 3-digit shorthand for hex color is a valid format,
        // we ignore it for simplicity's sake
        return /^(#[0-9a-fA-F]{6}|[0-9a-fA-F]{6})$/.test(value)
          ? value
          : undefined;
      }}
      toText={(i) => i}
      onChange={onChange}
      label="HEX"
      className={styles.hexColorInput}
    />
  );
}
