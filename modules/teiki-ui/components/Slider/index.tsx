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
  classNames?: Partial<{
    [k in SubComponent]: string;
  }>;
  styles?: Partial<{
    [k in SubComponent]: React.CSSProperties;
  }>;
};

function forwardClassNameAndStyle(component: SubComponent, props: Props) {
  return {
    className: cx([styles[component], props.classNames?.[component]]),
    style: props.styles?.[component],
  };
}

export default function Slider(props: Props) {
  const {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    styles: _styles,
    classNames: _classNames,
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
      {...forwardClassNameAndStyle("container", props)}
    >
      <Slider$Radix.Track {...forwardClassNameAndStyle("track", props)}>
        <Slider$Radix.Range {...forwardClassNameAndStyle("range", props)} />
      </Slider$Radix.Track>
      <Slider$Radix.Thumb
        {...forwardClassNameAndStyle("thumb", props)}
        {...others}
      />
    </Slider$Radix.Root>
  );
}
