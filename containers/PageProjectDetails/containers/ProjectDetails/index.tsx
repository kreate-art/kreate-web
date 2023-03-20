import cx from "classnames";
import * as React from "react";

import TabControl from "./components/TabControl";
import FAQs from "./containers/FAQs";
import TabActivities from "./containers/TabActivities";
import TabUpdates from "./containers/TabUpdates";
import styles from "./index.module.scss";

import {
  AnyProjectPost,
  LovelaceAmount,
  ProjectBenefitsTier,
  ProjectCommunity,
  ProjectDescription,
} from "@/modules/business-types";
import { ProjectActivity } from "@/modules/business-types";
import RichTextViewer from "@/modules/teiki-components/components/RichTextViewer";

type Props = {
  className?: string;
  projectId: string | undefined;
  description: ProjectDescription;
  community: ProjectCommunity;
  announcements: AnyProjectPost[];
  activities: ProjectActivity[];
  activeTabIndex: number;
  totalStaked?: LovelaceAmount;
  tiers?: ProjectBenefitsTier[];
  onChangeActiveTabIndex: (value: number) => void;
  onClickBecomeMember?: () => void;
};

export const TABS = [
  { title: "About", hash: "#about" },
  { title: "Posts", hash: "#posts" },
  { title: "FAQs", hash: "#faqs" },
  { title: "Activities", hash: "#activities" },
];

export default function ProjectDetails({
  className,
  projectId,
  description,
  community,
  announcements,
  activities,
  activeTabIndex,
  totalStaked,
  tiers,
  onChangeActiveTabIndex,
  onClickBecomeMember,
}: Props) {
  return (
    <div className={cx(className, styles.container)}>
      <TabControl
        tabs={TABS}
        value={activeTabIndex}
        onChange={onChangeActiveTabIndex}
      />
      {activeTabIndex == 0 ? ( // About
        <div className={styles.richTextEditorContainer}>
          <RichTextViewer
            key={`${projectId}#description`}
            value={description.body}
            className={styles.richTextEditor}
          />
        </div>
      ) : activeTabIndex == 1 ? ( // Posts
        <TabUpdates
          value={announcements}
          totalStaked={totalStaked}
          tiers={tiers}
          onClickBecomeMember={onClickBecomeMember}
        />
      ) : activeTabIndex == 2 ? ( // FAQs
        <FAQs faqs={community.frequentlyAskedQuestions} />
      ) : activeTabIndex === 3 ? ( // Activities
        <TabActivities value={activities} projectId={projectId} />
      ) : null}
    </div>
  );
}
