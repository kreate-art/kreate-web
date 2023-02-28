import React from "react";
import { Input } from "semantic-ui-react";

import FAQAccordion from "./FAQAccordion";
import styles from "./index.module.scss";

import { joinWithSeparator } from "@/modules/array-utils";
import { FrequentlyAskedQuestion } from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  faqs: FrequentlyAskedQuestion[];
};

export default function FAQs({ faqs }: Props) {
  const [listedFAQs, setListedFAQs] =
    React.useState<FrequentlyAskedQuestion[]>(faqs);

  function filterFAQs(searchValue: string) {
    const listedFAQs = faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(searchValue.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setListedFAQs(listedFAQs);
  }

  return (
    <div className={styles.container}>
      <div className={styles.faqSearchBar}>
        <Input
          placeholder="Search"
          className={styles.input}
          icon="search"
          iconPosition="left"
          onChange={(newValue) => {
            filterFAQs(newValue.target.value);
          }}
        />
      </div>
      {joinWithSeparator(
        listedFAQs
          .filter(
            (faq: FrequentlyAskedQuestion) => !!faq.answer && !!faq.question
          )
          .map((faq: FrequentlyAskedQuestion, index: number) => (
            <FAQAccordion
              question={faq.question}
              answer={faq.answer}
              key={index}
            />
          )),
        <Divider.Horizontal style={{ marginBottom: "32px" }} />
      )}
    </div>
  );
}
