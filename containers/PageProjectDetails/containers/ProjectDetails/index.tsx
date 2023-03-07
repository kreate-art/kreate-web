import cx from "classnames";
import * as React from "react";

import TabControl from "./components/TabControl";
import FAQs from "./containers/FAQs";
import TabActivities from "./containers/TabActivities";
import TabUpdates from "./containers/TabUpdates";
import styles from "./index.module.scss";

import {
  ProjectAnnouncement,
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
  activities: ProjectActivity[];
  activeTabIndex: number;
  onChangeActiveTabIndex: (value: number) => void;
};

export const TABS = [
  { title: "Campaign", hash: "#campaign" },
  { title: "Announcements", hash: "#announcements" },
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
  onChangeActiveTabIndex,
}: Props) {
  return (
    <div className={cx(className, styles.container)}>
      <TabControl
        tabs={TABS}
        value={activeTabIndex}
        onChange={onChangeActiveTabIndex}
      />
      {activeTabIndex == 0 ? ( // Campaign
        <div className={styles.richTextEditorContainer}>
          <RichTextEditor
            key={projectId}
            value={description.body}
            className={styles.richTextEditor}
          />
        </div>
      ) : activeTabIndex == 1 ? ( // Announcements
        <TabUpdates value={announcements} />
      ) : activeTabIndex == 2 ? ( // FAQs
        <FAQs faqs={community.frequentlyAskedQuestions} />
      ) : activeTabIndex === 3 ? ( // Activities
        <TabActivities value={activities} projectId={projectId} />
      ) : null}
    </div>
  );
}
