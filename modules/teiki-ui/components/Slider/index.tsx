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

function mergeDisplayOptions(
  component: SubComponent,
  displayOptions: Props["displayOptions"]
) {
  return {
    className: cx([styles[component], displayOptions?.[component]?.className]),
    style: displayOptions?.[component]?.style,
  };
}

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
      {...mergeDisplayOptions("container", displayOptions)}
    >
      <Slider$Radix.Track {...mergeDisplayOptions("track", displayOptions)}>
        <Slider$Radix.Range {...mergeDisplayOptions("range", displayOptions)} />
      </Slider$Radix.Track>
      <Slider$Radix.Thumb
        {...mergeDisplayOptions("thumb", displayOptions)}
        {...others}
      />
    </Slider$Radix.Root>
  );
}
