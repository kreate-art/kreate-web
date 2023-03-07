import cx from "classnames";
import * as React from "react";

import TabControl from "./components/TabControl";
import FAQs from "./containers/FAQs";
import TabActivities from "./containers/TabActivities";
import TabUpdates from "./containers/TabUpdates";
import styles from "./index.module.scss";

import {
  ProjectAnnouncement,
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
  announcements: ProjectAnnouncement[];
  benefits: ProjectBenefits;
  activities: ProjectActivity[];
  activeTabIndex: number;
  onChangeActiveTabIndex: (value: number, hash: string) => void;
};

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
        value={activeTabIndex}
        numOfPosts={announcements.length}
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
        <div className={styles.richTextEditorContainer}>
          <RichTextEditor
            key={`${projectId}#benefits`}
            value={benefits.perks}
            className={styles.richTextEditor}
          />
        </div>
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
