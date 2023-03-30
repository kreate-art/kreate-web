import cx from "classnames";
import { HexColorPicker } from "react-colorful";

import InputColor, { ColorSystem } from "./components/InputColor";
import Interactive from "./components/Interactive";
import styles from "./index.module.scss";
import { Color } from "./types";
import {
  randomHexColor,
  hexToRgb,
  rgbToHsl,
  changeColorHueValue,
} from "./utils";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  // Warning: We assume that value prop is a valid hex color.
  // Things might break if it's not
  value: Color;
  onChange?: (value: Color) => void;
  showColorSuggestions?: boolean;
  buttonSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const COLOR_SYSTEMS: ColorSystem[] = ["hex", "rgb", "cmyk", "hsl"];

function ColorPicker(props: Props) {
  const {
    value,
    showColorSuggestions = false,
    buttonSlot,
    className,
    style,
  } = props;

  // Prevent React hydration error since we are generating colors randomly
  const colorSuggestions = useComputationOnMount(() => randomHexColor(18));

  const onChange = (hex: string) => {
    hex = hex.toUpperCase();
    if (hex[0] !== "#") hex = `#${hex}`;
    props.onChange?.(hex);
  };

  const hue = rgbToHsl(hexToRgb(value))[0];
  const hueSlider = (
    <Interactive
      onMove={(e) => {
        const hueValue = Math.round(e.left * 360);
        onChange(changeColorHueValue(value, hueValue));
      }}
      onKey={(e) => {
        const hueValue = hue + e.left * 360;
        onChange(changeColorHueValue(value, hueValue));
      }}
      aria-label="Hue"
      className={styles.hueSlider}
      aria-valuenow={hue}
      aria-valuemax="360"
      aria-valuemin="0"
    >
      <div
        className={styles.hueSliderHandle}
        style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
          left: `${(hue / 360) * 100}%`,
        }}
      ></div>
    </Interactive>
  );

  const colorInputs = (
    <div className={styles.inputsContainer}>
      {COLOR_SYSTEMS.map((system) => (
        <InputColor
          key={system}
          colorSystem={system}
          value={value}
          onChange={(color) => onChange(color)}
        />
      ))}
    </div>
  );

  return (
    <div className={cx([styles.container, className])} style={style}>
      <Flex.Row className={styles.topHalf}>
        <HexColorPicker
          color={value}
          onChange={onChange}
          className={styles.colorPallete}
        />

        <div className={styles.colorDisplay} style={{ backgroundColor: value }}>
          <div className={styles.buttonSlot}>{buttonSlot}</div>
        </div>
      </Flex.Row>

      <Flex.Col className={styles.bottomHalf}>
        {hueSlider}
        {colorInputs}
      </Flex.Col>

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
                  onClick={() => onChange(color)}
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
