import * as React from "react";
import useSWR from "swr";

import FooterPanel from "../PageHome/containers/FooterPanel";
import ProjectListItem from "../PageHome/containers/ProjectList/components/ProjectListItem";
import PanelActivities from "../PageProjectDetails/containers/PanelActivities";
import PanelBenefits from "../PageProjectDetails/containers/PanelBenefits";
import PanelTopBackers from "../PageProjectDetails/containers/PanelTopBackers";
import ProjectDetails from "../PageProjectDetails/containers/ProjectDetails";
import useDetailedProject from "../PageProjectDetails/hooks/useDetailedProject";
import { loadProjectFromBrowserStorage } from "../PageUpdateProjectV2/utils/storage";
import Podcast from "../Podcast";

import Section from "./components/Section";
import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";
import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import PanelProjectOverviewV2 from "@/modules/teiki-components/components/PanelProjectOverviewV2";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  storageId: string;
  projectId: string | undefined;
};

// const EMPTY_PROJECT_BENEFITS: ProjectBenefits = { tiers: [] };

export default function PagePreviewProject({ storageId, projectId }: Props) {
  useDefaultBackground();
  const componentMountedAt = useComputationOnMount(() => Date.now());

  const { data: project, error: projectError } = useSWR(
    ["e42d08e4-e58a-4bba-a289-71b17513bfee", storageId],
    async () => await loadProjectFromBrowserStorage(storageId),
    { revalidateOnFocus: true, refreshInterval: 10000 }
  );

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const { project: originalDetailedProject } = useDetailedProject(
    projectId ? { projectId, preset: "full" } : undefined
  );

  const projectGeneralInfo: ProjectGeneralInfo | undefined = project
    ? {
        id:
          originalDetailedProject?.id ||
          "00000000000000000000000000000000000000000000000000000000",
        basics: project.basics,
        community: project.community,
        history: {
          // NOTE: @sk-kitsune: field order here is very important
          createdAt: componentMountedAt || undefined,
          ...originalDetailedProject?.history,
          updatedAt: componentMountedAt || undefined,
        },
        stats: originalDetailedProject?.stats || {},
        categories: originalDetailedProject?.categories || {},
        censorship: originalDetailedProject?.censorship || [],
      }
    : undefined;

  if (projectError) {
    return <div>ERROR</div>;
  }

  return (
    <div>
      <TeikiHead />
      <Section style={{ margin: "64px 0" }}>
        <Typography.Div
          style={{ marginBottom: "24px" }}
          content="Kreator Card"
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
          content="Kreator Page"
          size="heading5"
          color="ink"
        />
        <Divider$Horizontal$CustomDash style={{ marginBottom: "56px" }} />
      </Section>
      <div className={styles.container}>
        <main className={styles.main}>
          {project && projectGeneralInfo ? (
            <div className={styles.content}>
              <div className={styles.header}>
                <PanelProjectOverviewV2
                  basics={projectGeneralInfo.basics}
                  history={projectGeneralInfo.history}
                  categories={projectGeneralInfo.categories}
                  match={undefined}
                  community={projectGeneralInfo.community}
                  options={{
                    buttonBackProject: {
                      visible: false,
                      isBacking: false,
                      disabled: false,
                    },
                    buttonUpdateProject: { visible: false, disabled: false },
                    buttonShare: {
                      visible: true,
                      disabled: false,
                      priority: true,
                    },
                    buttonPostUpdate: { visible: false, disabled: false },
                    buttonCloseProject: { visible: false, disabled: false },
                  }}
                />
              </div>
              {!project.tiers ? null : <PanelBenefits value={project.tiers} />}
              <div className={styles.detailsStatsPanels}>
                <div className={styles.mainPanels}>
                  <ProjectDetails
                    className={styles.details}
                    projectId={projectId}
                    description={project.description}
                    community={project.community}
                    announcements={originalDetailedProject?.announcements || []}
                    activities={originalDetailedProject?.activities || []}
                    activeTabIndex={activeTabIndex}
                    onChangeActiveTabIndex={(activeTabIndex) =>
                      setActiveTabIndex(activeTabIndex)
                    }
                  />
                </div>
                <div className={styles.rightPanels}>
                  <PanelTopBackers
                    value={originalDetailedProject?.topSupporters || []}
                  />
                  <PanelActivities
                    value={originalDetailedProject?.activities || []}
                    onClickAllActivities={() => setActiveTabIndex(3)}
                    id={undefined}
                  />
                </div>
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
