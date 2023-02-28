import * as React from "react";

import styles from "./index.module.scss";
import ProjectFAQEditor from "./ProjectFAQEditor";
import ProjectSocialChannelEditor from "./ProjectSocialChannelEditor";

import {
  FrequentlyAskedQuestion,
  ProjectCommunity,
} from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  value: ProjectCommunity;
  onChange?: (newValue: ProjectCommunity) => void;
};

export default function ProjectCommunityEditor({ value, onChange }: Props) {
  const handleChangeSocialChannel = (newValue: string[]) => {
    onChange && onChange({ ...value, socialChannels: newValue });
  };
  const handleChangeFAQ = (newValue: FrequentlyAskedQuestion[]) => {
    onChange && onChange({ ...value, frequentlyAskedQuestions: newValue });
  };

  return (
    <div className={styles.container}>
      <ProjectSocialChannelEditor
        value={value.socialChannels}
        onChange={handleChangeSocialChannel}
      />
      <Divider.Horizontal />
      <ProjectFAQEditor
        faqs={value.frequentlyAskedQuestions}
        onChange={handleChangeFAQ}
      />
    </div>
  );
}
