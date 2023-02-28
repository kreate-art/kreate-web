import { Slot } from "@radix-ui/react-slot";
import cx from "classnames";
import { useCombobox } from "downshift";
import * as React from "react";

import InputShell from "../../../InputShell";

import styles from "./index.module.scss";

export type Suggestion = {
  key: React.Key;
  value: string;
};

const PADDING_LEFT_TO_CLASS_NAME = {
  default: null,
  narrow: styles.paddingLeftNarrow,
  none: styles.paddingLeftNone,
};

const PADDING_RIGHT_TO_CLASS_NAME = {
  default: null,
  narrow: styles.paddingRightNarrow,
  none: styles.paddingRightNone,
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  onChange?: (value: string) => void;
  suggestions: Suggestion[];
  label?: React.ReactNode;
  zIndex?: number;
  paddingLeft?: keyof typeof PADDING_LEFT_TO_CLASS_NAME;
  paddingRight?: keyof typeof PADDING_RIGHT_TO_CLASS_NAME;
} & Pick<
  React.ComponentProps<typeof InputShell>,
  "topSlot" | "leftSlot" | "rightSlot" | "bottomSlot"
> &
  Pick<React.InputHTMLAttributes<HTMLInputElement>, "placeholder">;

export default function Text({
  className,
  style,
  value,
  onChange,
  suggestions,
  label,
  zIndex,
  paddingLeft = "default",
  paddingRight = "default",
  // props forwarded to <InputShell>
  topSlot,
  leftSlot,
  rightSlot,
  bottomSlot,
  // props forwarded to <input>
  placeholder,
}: Props) {
  // To understand how to use the returned value from useCombobox, read this article:
  // https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters
  const {
    getLabelProps,
    getInputProps,
    isOpen,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: suggestions,
    itemToString: (suggestion) => (suggestion ? suggestion.value : ""),
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      onChange && onChange(inputValue || "");
    },
  });

  const isMenuOpened = isOpen && !!suggestions.length;

  // We use Slot to make the code more readable and natural.
  return (
    <div className={cx(styles.container, className)} style={style}>
      {label ? (
        <Slot {...getLabelProps()}>
          <div className={styles.label}>{label}</div>
        </Slot>
      ) : null}
      <InputShell
        className={cx(
          styles.inputShell,
          isMenuOpened ? styles.menuOpened : null
        )}
        topSlot={topSlot}
        leftSlot={leftSlot}
        rightSlot={rightSlot}
        bottomSlot={bottomSlot}
      >
        <Slot {...getInputProps()}>
          <input
            className={cx(
              styles.input,
              PADDING_LEFT_TO_CLASS_NAME[paddingLeft],
              PADDING_RIGHT_TO_CLASS_NAME[paddingRight]
            )}
            placeholder={placeholder}
            // Read https://github.com/downshift-js/downshift/issues/1108
            // to understand why we need this
            onChange={(event) => onChange && onChange(event.target.value || "")}
          />
        </Slot>
      </InputShell>
      <Slot {...getMenuProps()}>
        <ul
          className={cx(styles.menu, isMenuOpened ? null : styles.hidden)}
          style={{ zIndex }}
        >
          {suggestions.map((item, index) => (
            <Slot key={item.key} {...getItemProps({ item, index })}>
              <li
                className={cx(
                  styles.item,
                  highlightedIndex === index ? styles.itemHighlighted : null
                )}
              >
                {item.value}
              </li>
            </Slot>
          ))}
        </ul>
      </Slot>
    </div>
  );
}
