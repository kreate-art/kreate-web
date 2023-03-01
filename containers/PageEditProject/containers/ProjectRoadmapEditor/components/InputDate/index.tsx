import * as React from "react";

import { convertDateAsDateIso } from "@/modules/business-types/utils/converters";
import Input from "@/modules/teiki-ui/components/Input";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: number;
  onChange: (newValue: number) => void;
};

function validateDateFormat(dateVal: string) {
  const validatePattern = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;
  const matched = validatePattern.exec(dateVal);
  if (!matched) return false;
  const [, year, month, day] = matched.map((element) => parseInt(element));
  const dateObject = new Date(year, month - 1, day);
  const timestamp = dateObject.valueOf();
  return !Number.isNaN(timestamp);
}

export default function InputDate({
  className,
  style,
  value,
  onChange,
}: Props) {
  const [text, setText] = React.useState<string | null>(null);
  return (
    <Input
      className={className}
      style={style}
      type="date"
      value={text == null ? convertDateAsDateIso(value) : text}
      onChange={(newText) => {
        if (validateDateFormat(newText)) {
          const newValue = new Date(newText).valueOf();
          onChange(newValue);
          setText(null);
        } else {
          setText(newText);
        }
      }}
    />
  );
}
