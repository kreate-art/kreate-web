import cx from "classnames";
import Image from "next/image";
import * as React from "react";

import IconChevronDown from "./icons/IconChevronDown";
import IconChevronUp from "./icons/IconChevronUp";
import imageNiko from "./images/niko.png";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Title from "@/modules/teiki-ui/components/Title";

type Suggestion = {
  key: React.Key;
  value: string;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: string;
  onChange?: (value: string) => void;
  suggestions: Suggestion[];
  zIndex?: number;
};

function getWordCount(text: string) {
  return text.split(/\s+/).filter((value) => !!value).length;
}

export default function InputSummaryWithSuggestions({
  className,
  style,
  value,
  onChange,
  suggestions,
  zIndex,
}: Props) {
  const [openPopover, setOpenPopover] = React.useState(false);

  const bottomSlot = (
    <div className={styles.bottomSlot}>
      <div className={styles.bottomSlotLeft}>
        <Image
          className={styles.imageNiko}
          src={imageNiko}
          alt="niko"
          width={24}
          height={24}
          placeholder="blur"
        />
        <Button.Link
          className={styles.buttonShowSuggestion}
          onClick={() => setOpenPopover(!openPopover)}
          disabled={!suggestions.length && !openPopover}
        >
          {!openPopover ? (
            <span>Show Suggestion</span>
          ) : (
            <span>Hide Suggestion</span>
          )}
          {!openPopover ? <IconChevronDown /> : <IconChevronUp />}
        </Button.Link>
      </div>
      <div>
        <span className={styles.wordCount}>{`${getWordCount(value)}/50`}</span>
      </div>
    </div>
  );

  return (
    <div
      className={cx(
        styles.container,
        className,
        openPopover ? styles.openPopover : null
      )}
      style={style}
    >
      <TextArea
        className={styles.textArea}
        value={value}
        onChange={onChange}
        resizable
        placeholder="We suggest to write a summary in 25 to 50 words, but you can go above or below that limit."
        bottomSlot={bottomSlot}
      />
      {openPopover ? (
        <div className={styles.popover} style={{ zIndex }}>
          <Title content="Suggested summary" />
          {suggestions.map((suggestion) => (
            <div key={suggestion.key}>{suggestion.value}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
