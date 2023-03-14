import React from "react";
import * as Uuid from "uuid";

import TierInput from "./components/TierInput";
import TierPreview from "./components/TierPreview";
import IconPlusSquare from "./icons/IconPlusSquare";
import styles from "./index.module.scss";

import { ProjectBenefits, ProjectBenefitsTier } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  value: ProjectBenefits;
  onChange: (newValue: ProjectBenefits) => void;
};

/**
 * `ProjectBenefitsEditor` is the editor of `ProjectBenefits`.
 *
 * It receives `value: ProjectBenefits`,
 * triggers `onChange(newValue)` on every change.
 */
export default function ProjectBenefitsEditor({ value, onChange }: Props) {
  const [focusedTierIndex, setFocusedTierIndex] = React.useState(0);
  function getSuggestedTierName() {
    let minIndex = 1;
    while (true) {
      const tierName = "Tier " + minIndex;
      if (value.tiers?.some((tier) => tier.title === tierName)) minIndex++;
      else return tierName;
    }
  }

  function addTier() {
    const tierName = getSuggestedTierName();
    onChange({
      tiers: [
        ...(value.tiers ?? []),
        {
          id: Uuid.v4(),
          title: tierName,
          description: "Description",
          banner: undefined,
          requiredStake: 0,
          benefits: [],
        },
      ],
    });
  }

  function updateTier(id: string, newValue: ProjectBenefitsTier) {
    onChange({
      tiers: (value.tiers ?? []).map((tier) =>
        tier.id === id ? newValue : tier
      ),
    });
  }

  function deleteTier(id: string) {
    onChange({
      tiers: (value.tiers ?? []).filter((tier) => tier.id !== id),
    });
  }

  return (
    <div className={styles.container}>
      <Flex.Col className={styles.editContainer} gap="16px">
        {!value.tiers
          ? null
          : value.tiers.map((tier, index) => (
              <div
                key={index}
                onClick={() => setFocusedTierIndex(index)}
                style={{ width: "100%" }}
              >
                <TierInput
                  value={tier}
                  onChange={(newValue: ProjectBenefitsTier) =>
                    updateTier(newValue.id, newValue)
                  }
                  onDelete={() => {
                    setFocusedTierIndex(0);
                    deleteTier(tier.id);
                  }}
                />
              </div>
            ))}
        <Button.Outline
          content="Add New Tier"
          icon={<IconPlusSquare />}
          size="small"
          onClick={addTier}
        />
      </Flex.Col>
      {!value.tiers || value.tiers.length <= focusedTierIndex ? null : (
        <TierPreview
          className={styles.previewContainer}
          value={value.tiers[focusedTierIndex]}
        />
      )}
    </div>
  );
}
