import { useState } from "react";

import styles from "../index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";

type Props<T> = {
  value: T;
  fromText: (text: string) => T | undefined;
  toText: (color: T) => string;
  onChange?: (color: T) => void;
  className?: string;
  label?: string;
};

export default function InputColor$Base<T>({
  value,
  toText,
  fromText,
  onChange,
  className,
  label,
}: Props<T>) {
  // We buffer dirty changes. The buffer is flush iff color input is valid
  // Otherwise, if the buffer is dirty (not null), we priotize using it over
  // value passed from props
  // When users blur from input, if the buffer is dirty, reset its value to the
  // last valid value
  const [dirtyValue, setDirtyValue] = useState<string | null>(null);

  return (
    <Flex.Col className={className} rowGap={4}>
      <span className={styles.colorInputLabel}>{label}</span>

      <Input
        value={dirtyValue ?? toText(value)}
        onChange={(newInput) => {
          const color$Parsed = fromText(newInput);
          if (color$Parsed) onChange?.(color$Parsed);
          setDirtyValue(newInput);
        }}
        onBlur={() => dirtyValue != null && setDirtyValue(null)}
      />
    </Flex.Col>
  );
}
