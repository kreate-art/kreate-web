import cx from "classnames";
import * as React from "react";

import MilestoneDetail from "../../../PageEditProject/containers/ProjectRoadmapEditor/components/MilestoneDetail";
import FAQs from "../../../PageProjectDetails/containers/ProjectDetails/containers/FAQs";

import TabControl from "./components/TabControl";
import styles from "./index.module.scss";

import {
  ProjectCommunity,
  ProjectDescription,
  ProjectMilestone,
  ProjectRoadmap,
} from "@/modules/business-types";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";

type Props = {
  className?: string;
  roadmap: ProjectRoadmap;
  community: ProjectCommunity;
  description: ProjectDescription;
};

export default function ProjectDetails({
  className,
  roadmap,
  community,
  description,
}: Props) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  return (
    <div className={cx(className, styles.container)}>
      <TabControl
        tabs={[
          { title: "Campaign" },
          { title: "Roadmap" },
          // TODO: @sk-kitsune: enable when announcements are ready.
          // TODO: @sk-tenba: create demo announcements for the projects
          { title: "Announcements", disabled: true },
          { title: "FAQs" },
          // TODO: @sk-kitsune: enable when activities are ready.
          { title: "Activities", disabled: true },
        ]}
        value={activeTabIndex}
        onChange={(value) => setActiveTabIndex(value)}
      />
      {activeTabIndex == 0 ? ( // Campaign
        <div className={styles.richTextEditorContainer}>
          <RichTextEditor
            value={description.body}
            className={styles.richTextEditor}
          />
        </div>
      ) : activeTabIndex == 1 ? ( // Roadmaps
        <div className={styles.roadmapMain}>
          {roadmap.map((milestone: ProjectMilestone, index: number) => (
            <MilestoneDetail {...milestone} key={index} />
          ))}
        </div>
      ) : activeTabIndex == 3 ? ( // FAQs
        <FAQs faqs={community.frequentlyAskedQuestions} />
      ) : null}
    </div>
  );
}
