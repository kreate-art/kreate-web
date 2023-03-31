import cx from "classnames";
import { HexColorPicker } from "react-colorful";

import InputColor$Cmyk from "./components/InputColor$Cmyk";
import InputColor$Hex from "./components/InputColor$Hex";
import InputColor$Hsl from "./components/InputColor$Hsl";
import InputColor$Rgb from "./components/InputColor$Rgb";
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
import Slider from "@/modules/teiki-ui/components/Slider";
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

function ColorPicker(props: Props) {
  const {
    value: color,
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

  const hue = rgbToHsl(hexToRgb(color))[0];
  const hueSlider = (
    <Slider
      value={hue}
      min={0}
      max={360}
      step={1}
      displayOptions={{
        container: {
          className: styles.hueSlider,
        },
        track: {
          className: styles.hueSliderTrack,
        },
        thumb: {
          className: styles.hueSliderHandle,
          style: { backgroundColor: `hsl(${hue}, 100%, 50%)` },
        },
      }}
      onChange={(newHue) => onChange(changeColorHueValue(color, newHue))}
      aria-label="Slider controlling hue value of the selecting color"
    />
  );

  const colorInputs = (
    <div className={styles.inputsContainer}>
      <InputColor$Hex value={color} onChange={onChange} />
      <InputColor$Rgb value={color} onChange={onChange} />
      <InputColor$Cmyk value={color} onChange={onChange} />
      <InputColor$Hsl value={color} onChange={onChange} />
    </div>
  );

  return (
    <div className={cx([styles.container, className])} style={style}>
      <Flex.Row className={styles.topHalf}>
        <HexColorPicker
          color={color}
          onChange={onChange}
          className={styles.colorPallete}
        />

        <div className={styles.colorDisplay} style={{ backgroundColor: color }}>
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
