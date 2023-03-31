import * as Slider$Radix from "@radix-ui/react-slider";
import cx from "classnames";

import styles from "./index.module.scss";

type SubComponent = "container" | "track" | "thumb" | "range";

export type Props = {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  displayOptions?: {
    [k in SubComponent]?: {
      className?: string;
      style?: React.CSSProperties;
    };
  };
};

export default function Slider(props: Props) {
  const {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    displayOptions,
    disabled,
    ...others
  } = props;

  return (
    <Slider$Radix.Root
      value={[value]}
      max={max}
      min={min}
      step={step}
      onValueChange={([value]) => onChange?.(value)}
      disabled={disabled}
      className={cx([styles.container, displayOptions?.container?.className])}
      style={displayOptions?.container?.style}
    >
      <Slider$Radix.Track
        className={cx([styles.track, displayOptions?.track?.className])}
        style={displayOptions?.track?.style}
      >
        <Slider$Radix.Range
          className={cx([styles.range, displayOptions?.range?.className])}
          style={displayOptions?.range?.style}
        />
      </Slider$Radix.Track>
      <Slider$Radix.Thumb
        className={cx([styles.thumb, displayOptions?.thumb?.className])}
        style={displayOptions?.thumb?.style}
        {...others}
      />
    </Slider$Radix.Root>
  );
}
