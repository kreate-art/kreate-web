import cx from "classnames";
import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import styles from "./index.module.scss";
import { randomHexColor, hexToRgb, rgbToHex, ColorSubComponent } from "./utils";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

// #RRGGBB (uppercase)
export type Color = string;

type Props = {
  value: Color;
  onChange?: (value: Color) => void;
  showColorSuggestions?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// We allow user to paste abitrary values, hence string not number
type RgbString = [string, string, string];

function ColorPicker(props: Props) {
  const {
    value,
    onChange,
    showColorSuggestions = false,
    className,
    style,
  } = props;

  // Prevent React hydration error since we are generating colors randomly
  const colorSuggestions = useComputationOnMount(() => randomHexColor(18));

  // We buffer dirty changes. The buffer is flush iff color input is valid
  // Otherwise, if the buffer is dirty (not null), we priotize using it over
  // value passed from props
  const [dirtyChanges, setDirtyChanges] = useState<RgbString | null>(null);
  const rgb$Source =
    dirtyChanges ?? (hexToRgb(value).map((i) => i.toString()) as RgbString);

  const commitColor = (hex: string) => {
    hex = hex.toUpperCase();
    if (hex[0] !== "#") hex = `#${hex}`;
    onChange?.(hex);
    setDirtyChanges(null);
  };

  const colorInputs = (
    <Flex.Row className={styles.colorInputContainer} columnGap={8}>
      <Flex.Col alignItems="center" rowGap={4} flexGrow={1}>
        <HexColorInput
          color={value}
          onChange={(color) => {
            // Although, 3-digit shorthand for hex color is a valid format,
            // we ignore it for simplicity's sake
            if (color.length === 7) commitColor(color);
          }}
          className={styles.colorInputHex}
        />
        <span>Hex</span>
      </Flex.Col>

      {(["R", "G", "B"] as ColorSubComponent[]).map((pigment) => {
        let index: number;
        switch (pigment) {
          case "R":
            index = 0;
            break;
          case "G":
            index = 1;
            break;
          case "B":
            index = 2;
            break;
        }
        return (
          <Flex.Col alignItems="center" rowGap={4} flexGrow={0} key={pigment}>
            <input
              aria-label={`Input controlling ${pigment} value of color`}
              value={rgb$Source[index]}
              className={styles.colorInputRGB}
              onChange={(e) => {
                const newRgb = rgb$Source.map((v, i) =>
                  i === index ? e.target.value : v
                ) as RgbString;
                const hex = rgbToHex(newRgb);
                if (hex) commitColor(hex);
                else setDirtyChanges(newRgb);
              }}
            />
            <Typography.Span color="ink80">{pigment}</Typography.Span>
          </Flex.Col>
        );
      })}
    </Flex.Row>
  );

  return (
    <div className={cx([styles.container, className])} style={style}>
      <HexColorPicker
        color={value}
        onChange={commitColor}
        className={styles.colorPallete}
      />
      {colorInputs}
      {colorSuggestions && showColorSuggestions && (
        <>
          <Divider.Horizontal />
          <Flex.Col rowGap={8} className={styles.suggestionsContainer}>
            <Typography.Span color="ink80">Suggested colors:</Typography.Span>
            <Flex.Row flexWrap="wrap" columnGap={12} rowGap={8}>
              {colorSuggestions.map((color) => (
                <div
                  key={color}
                  className={styles.suggestion}
                  style={{ backgroundColor: `#${color}` }}
                  onClick={() => commitColor(color)}
                ></div>
              ))}
            </Flex.Row>
          </Flex.Col>
        </>
      )}
    </div>
  );
}

export default ColorPicker;
