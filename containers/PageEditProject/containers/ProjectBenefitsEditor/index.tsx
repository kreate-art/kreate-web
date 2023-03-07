import GrammarlyWrapper from "../../../../components/GrammarlyWrapper";

import styles from "./index.module.scss";

import { ProjectBenefits } from "@/modules/business-types";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";

type Props = {
  value: ProjectBenefits;
  onChange?: (newValue: ProjectBenefits) => void;
};

/**
 * `ProjectBenefitsEditor` is the editor of `ProjectBenefits`.
 *
 * It receives `value: ProjectBenefits`,
 * triggers `onChange(newValue)` on every change.
 */

export default function ProjectBenefitsEditor({ value, onChange }: Props) {
  return (
    <div className={styles.container}>
      <GrammarlyWrapper>
        <RichTextEditor
          value={value.perks}
          onChange={(newPerks) => {
            onChange && onChange({ ...value, perks: newPerks });
          }}
          isBorderless={true}
        />
      </GrammarlyWrapper>
    </div>
  );
}
