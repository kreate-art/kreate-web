import GrammarlyWrapper from "../../../../components/GrammarlyWrapper";

import styles from "./index.module.scss";

import { ProjectDescription } from "@/modules/business-types";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";

type Props = {
  value: ProjectDescription;
  onChange?: (newValue: ProjectDescription) => void;
};

/**
 * `ProjectDescriptionEditor` is the editor of `ProjectDescription`.
 *
 * It receives `value: ProjectDescription`,
 * triggers `onChange(newValue)` on every change.
 */

export default function ProjectDescriptionEditor({ value, onChange }: Props) {
  return (
    <div className={styles.container}>
      <GrammarlyWrapper>
        <RichTextEditor
          value={value.body}
          onChange={(newBody) => {
            onChange && onChange({ ...value, body: newBody });
          }}
          isBorderless={true}
        />
      </GrammarlyWrapper>
    </div>
  );
}
