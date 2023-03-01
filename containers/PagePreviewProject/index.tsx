import * as React from "react";
import useSWR from "swr";

import { ProjectGeneralInfo } from "../../modules/business-types";
import Divider$Horizontal$CustomDash from "../../modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import FooterPanel from "../PageHome/containers/FooterPanel";
import ProjectListItem from "../PageHome/containers/ProjectList/components/ProjectListItem";
import { loadProjectFromBrowserStorage } from "../PageUpdateProjectV2/utils/storage";
import Podcast from "../Podcast";

import Backdrop from "./components/Backdrop";
import Section from "./components/Section";
import ProjectDetails from "./containers/ProjectDetails";
import styles from "./index.module.scss";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import PanelProjectOverview from "@/modules/teiki-components/components/PanelProjectOverview";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  storageId: string;
};

export default function PagePreviewProject({ storageId }: Props) {
  useDefaultBackground();
  const componentMountedAt = useComputationOnMount(() => Date.now());

  const { data: project, error: projectError } = useSWR(
    ["e42d08e4-e58a-4bba-a289-71b17513bfee", storageId],
    async () => await loadProjectFromBrowserStorage(storageId),
    { revalidateOnFocus: true, refreshInterval: 10000 }
  );

  const projectGeneralInfo: ProjectGeneralInfo | null = project
    ? {
        id: "00000000000000000000000000000000000000000000000000000000",
        basics: project.basics,
        community: project.community,
        history: {
          createdAt: componentMountedAt || undefined,
          updatedAt: componentMountedAt || undefined,
        },
        stats: {
          numSupporters: 0,
          numLovelacesStaked: 0,
          numLovelacesRaised: 0,
        },
        categories: {},
        censorship: [],
      }
    : null;

  if (projectError) {
    return <div>ERROR</div>;
  }

  return (
    <div>
      <TeikiHead />
      <Section style={{ margin: "64px 0" }}>
        <Typography.Div
          style={{ marginBottom: "24px" }}
          content="Project Card"
          size="heading5"
          color="ink"
        />
        <Divider$Horizontal$CustomDash style={{ marginBottom: "56px" }} />
        {projectGeneralInfo ? (
          <ProjectListItem
            style={{ maxWidth: "1080px" }}
            value={projectGeneralInfo}
            borderless
          />
        ) : null}
      </Section>
      <Section>
        <Typography.Div
          style={{ marginBottom: "24px" }}
          content="Project Details"
          size="heading5"
          color="ink"
        />
        <Divider$Horizontal$CustomDash style={{ marginBottom: "56px" }} />
      </Section>
      <div className={styles.container}>
        <main className={styles.main}>
          <Backdrop
            className={styles.backdrop}
            coverImages={project?.basics?.coverImages}
          />
          {project && projectGeneralInfo ? (
            <div className={styles.content}>
              <div className={styles.header}>
                <PanelProjectOverview
                  basics={projectGeneralInfo.basics}
                  history={projectGeneralInfo.history}
                  categories={projectGeneralInfo.categories}
                  stats={projectGeneralInfo.stats}
                  community={projectGeneralInfo.community}
                  options={{
                    buttonBackProject: { visible: false, disabled: false },
                    buttonUpdateProject: { visible: true, disabled: false },
                    buttonShare: { visible: true, disabled: false },
                    buttonPostUpdate: { visible: true, disabled: false },
                    buttonCloseProject: { visible: true, disabled: false },
                  }}
                />
              </div>
              <div className={styles.detailsStatsPanels}>
                <div className={styles.mainPanels}>
                  <ProjectDetails
                    className={styles.details}
                    description={project.description}
                    roadmap={project.roadmapInfo}
                    community={project.community}
                  />
                </div>
                <div className={styles.rightPanels}>{/* nothing here */}</div>
              </div>
            </div>
          ) : null}
        </main>
        <FooterPanel />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </div>
  );
}
