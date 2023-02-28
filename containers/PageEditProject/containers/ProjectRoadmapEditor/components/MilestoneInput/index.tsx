import * as React from "react";

import GrammarlyWrapper from "../../../../../../components/GrammarlyWrapper";
// import FundingSuggestion from "../FundingSuggestion";
import InputDate from "../InputDate";

import IconArrowDown from "./assets/IconArrowDown";
import IconArrowUp from "./assets/IconArrowUp";
import IconTrash from "./assets/IconTrash";
import styles from "./index.module.scss";

import {
  formatLovelaceAmount,
  formatUsdAmount,
  parseLovelaceAmount,
} from "@/modules/bigint-utils";
import { ProjectMilestone } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Checkbox from "@/modules/teiki-ui/components/Checkbox";
import Divider from "@/modules/teiki-ui/components/Divider";
import Input from "@/modules/teiki-ui/components/Input";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  value: ProjectMilestone;
  onChange: (newValue: ProjectMilestone) => void;
  onDelete: () => void;
};

export default function MilestoneInput({ value, onChange, onDelete }: Props) {
  const { adaPriceInfo } = useAppContextValue$Consumer();
  const adaPriceInUsd = adaPriceInfo?.usd;
  const [isOpened, setIsOpened] = React.useState(true);
  // const [showDropdown, setShowDropdown] = React.useState(false);
  const [lovelaceInput, setLovelaceInput] = React.useState(
    value.funding
      ? formatLovelaceAmount(value.funding, {
          excludeThousandsSeparator: true,
          useMaxPrecision: true,
        })
      : ""
  );
  const parsedFunding = parseLovelaceAmount(lovelaceInput);
  return (
    <div className={styles.milestoneInput}>
      <div className={styles.heading}>
        <Title className={styles.milestoneTitle} content={value.name} />
        <div className={styles.icons}>
          <button className={styles.icon} onClick={onDelete}>
            <IconTrash />
          </button>
          <button
            className={styles.icon}
            onClick={() => setIsOpened(!isOpened)}
          >
            {isOpened ? <IconArrowUp /> : <IconArrowDown />}
          </button>
        </div>
      </div>
      {isOpened && (
        <>
          <Divider.Horizontal className={styles.divider} />
          <div className={styles.inputContainer}>
            <div className={styles.inputField}>
              <Title content="Date" />
              <InputDate
                value={value.date}
                onChange={(newValue: number) => {
                  onChange({ ...value, date: newValue });
                }}
              />
            </div>
            <div className={styles.inputField}>
              <Title content="Name" />
              <Input
                placeholder="Name"
                value={value.name}
                onChange={(name) => {
                  onChange({ ...value, name });
                }}
              />
            </div>
            <div className={styles.inputField}>
              <Title content="Description" />
              <GrammarlyWrapper>
                <TextArea
                  placeholder="Description"
                  value={value.description}
                  onChange={(description) => {
                    onChange({ ...value, description });
                  }}
                />
              </GrammarlyWrapper>
            </div>
            <div className={styles.inputField}>
              <Title content="Funding" />
              <Input
                // onFocus={() => setShowDropdown(true)}
                // onBlur={() => setShowDropdown(false)}
                value={lovelaceInput}
                onChange={(funding) => {
                  const formattedFunding = funding.replace(/[^0-9.]+/g, "");
                  const parsedFunding = parseLovelaceAmount(formattedFunding);
                  onChange({
                    ...value,
                    funding: parsedFunding,
                  });
                  setLovelaceInput(formattedFunding);
                }}
                rightSlot={<Title className={styles.iconAda} content="₳" />}
                error={lovelaceInput !== "" && parsedFunding == null}
              />
              <div className={styles.fundingBotSlot}>
                <div className={styles.usdPrice}>
                  {value.funding != null && adaPriceInUsd
                    ? formatUsdAmount(
                        { lovelaceAmount: value.funding, adaPriceInUsd },
                        {
                          includeAlmostEqualToSymbol: true,
                          includeCurrencySymbol: true,
                        }
                      )
                    : "≈ ... USD"}
                </div>
                <div className={styles.warning}>
                  {lovelaceInput !== "" && value.funding == null
                    ? "Invalid funding"
                    : ""}
                </div>
              </div>
            </div>
            {/* {showDropdown && (
                <div
                  className={styles.fundingListWrapper}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    // This will cancel the event that hide the dropdown before the suggestion button is clicked
                  }}
                >
                  <FundingSuggestion
                    title="Avg funding per milestone"
                    value={10000}
                    onClick={() => {
                      onChange({ ...value, funding: 10000 });
                      setShowDropdown(false);
                    }}
                  />
                  <FundingSuggestion
                    title="Avg funding of similar projects"
                    value={15000}
                    onClick={() => {
                      onChange({ ...value, funding: 15000 });
                      setShowDropdown(false);
                    }}
                  />
                </div>
              )} */}
            <div className={styles.isCompletedInput}>
              <Title content="Completed" />
              <Checkbox
                className={styles.switch}
                value={value.isCompleted}
                onChange={(isCompleted) => onChange({ ...value, isCompleted })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
