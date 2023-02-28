import * as React from "react";

import GrammarlyWrapper from "../../../../../components/GrammarlyWrapper";

import Accordion from "./components/Accordion";
import IconPlus from "./icons/IconPlus";
import styles from "./index.module.scss";

import { FrequentlyAskedQuestion } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  faqs: FrequentlyAskedQuestion[];
  onChange: (newFAQs: FrequentlyAskedQuestion[]) => void;
};

export default function ProjectFAQEditor({ faqs, onChange }: Props) {
  return (
    <div className={styles.container}>
      <Typography.Div>
        <Typography.Span content="FAQ" size="heading5" />
        <Typography.Span
          className={styles.titleMessage}
          content="We suggest entering at least 3 FAQs for your community!"
          size="bodyExtraSmall"
        />
      </Typography.Div>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          return (
            <Accordion
              /**TODO: @sk-tenba: use UUID for key and perform necessary refactoring */
              key={index}
              title={"FAQ " + (index + 1)}
              onRemove={() => {
                onChange(faqs.filter((_, i) => i !== index));
              }}
            >
              <Title content="Question" className={styles.titleQuestion} />
              <GrammarlyWrapper>
                <TextArea
                  value={faq.question}
                  className={styles.textArea}
                  onChange={(value) => {
                    const newFAQs = [...faqs];
                    newFAQs[index] = {
                      ...newFAQs[index],
                      question: value,
                    };
                    onChange(newFAQs);
                  }}
                  placeholder="Name"
                />
              </GrammarlyWrapper>
              <Title content="Answer" className={styles.titleAnswer} />
              <GrammarlyWrapper>
                <TextArea
                  value={faq.answer}
                  onChange={(value) => {
                    const newFAQs = [...faqs];
                    newFAQs[index] = {
                      ...newFAQs[index],
                      answer: value,
                    };
                    onChange(newFAQs);
                  }}
                  placeholder="Description"
                  className={styles.textAreaAnswer}
                />
              </GrammarlyWrapper>
            </Accordion>
          );
        })}
      </div>

      <div className={styles.buttonNewFAQContainer}>
        <Button.Solid
          onClick={() => {
            onChange([...faqs, { question: "", answer: "" }]);
          }}
          color="green"
          icon={<IconPlus />}
          className={styles.buttonNewFAQ}
        >
          Add Question
        </Button.Solid>
      </div>
    </div>
  );
}
