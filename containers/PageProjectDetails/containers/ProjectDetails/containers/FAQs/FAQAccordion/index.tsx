import React from "react";

import IconCaretDown from "./components/IconCaretDown";
import IconCaretUp from "./components/IconCaretUp";
import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  question: string;
  answer: string;
};

export default function FAQAccordion({ question, answer }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <div className={styles.collapse}>
      <button
        className={styles.collapseHead}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* TODO: @sk-umiuma: display tooltip */}
        <Typography.Div
          maxLines={2}
          size="heading3"
          fontWeight="semibold"
          content={question}
        />
        {isOpen ? (
          <IconCaretUp className={styles.icon} />
        ) : (
          <IconCaretDown className={styles.icon} />
        )}
      </button>

      {isOpen && (
        <Typography.Div
          size="bodySmall"
          color="ink80"
          content={answer}
          style={{ whiteSpace: "pre-wrap" }}
        />
      )}
    </div>
  );
}
