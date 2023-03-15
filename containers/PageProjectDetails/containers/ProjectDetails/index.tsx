import cx from "classnames";
import * as React from "react";

import TabControl from "./components/TabControl";
import FAQs from "./containers/FAQs";
import TabActivities from "./containers/TabActivities";
import TabUpdates from "./containers/TabUpdates";
import styles from "./index.module.scss";

import {
  AnyProjectPost,
  ProjectBenefits,
  ProjectCommunity,
  ProjectDescription,
} from "@/modules/business-types";
import { ProjectActivity } from "@/modules/business-types";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";

type Props = {
  className?: string;
  projectId: string | undefined;
  description: ProjectDescription;
  community: ProjectCommunity;
  announcements: AnyProjectPost[];
  benefits: ProjectBenefits;
  activities: ProjectActivity[];
  activeTabIndex: number;
  onChangeActiveTabIndex: (value: number) => void;
};

export const TABS = [
  { title: "About", hash: "#about" },
  { title: "Benefits", hash: "#benefits" },
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
  benefits,
  activities,
  activeTabIndex,
  onChangeActiveTabIndex,
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
          <RichTextEditor
            key={`${projectId}#description`}
            value={description.body}
            className={styles.richTextEditor}
          />
        </div>
      ) : activeTabIndex == 1 ? ( // Benefits
        <div className={styles.richTextEditorContainer} />
      ) : activeTabIndex == 2 ? ( // Posts
        <TabUpdates value={announcements} />
      ) : activeTabIndex == 3 ? ( // FAQs
        <FAQs faqs={community.frequentlyAskedQuestions} />
      ) : activeTabIndex === 4 ? ( // Activities
        <TabActivities value={activities} projectId={projectId} />
      ) : null}
    </div>
  );
}
