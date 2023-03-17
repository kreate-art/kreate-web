import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import ProjectEditor from "../PageEditProject/containers/ProjectEditor";

import ModalPostAnnouncement from "./containers/ModalPostAnnouncement";
import { newProjectAnnouncement } from "./containers/ModalPostAnnouncement/utils";
import ModalProjectUpdatedSuccessfully from "./containers/ModalProjectUpdatedSuccessfully";
import ModalUpdateProject from "./containers/ModalUpdateProject";
import styles from "./index.module.scss";
import {
  getStorageId,
  loadProject,
  saveProjectToBrowserStorage,
} from "./utils/storage";

import { ProjectCommunityUpdate } from "@/modules/business-types";
import {
  formatAutoSaverStatus,
  useAutoSaver,
} from "@/modules/common-hooks/hooks/useAutoSaver";
import { useState$Async } from "@/modules/common-hooks/hooks/useState$Async";
import { useModalPromises } from "@/modules/modal-promises";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  projectId: string;
};

export default function PageUpdateProjectV2({
  className,
  style,
  projectId,
}: Props) {
  const { showModal } = useModalPromises();
  const router = useRouter();

  const [project, setProject, projectError] = useState$Async(
    async () => await loadProject(projectId),
    [projectId]
  );

  const autoSaveStatus = useAutoSaver({
    value: project,
    onSave: async (project) => {
      if (!project) return;
      await saveProjectToBrowserStorage(getStorageId(projectId), project);
    },
    onError: (error) => {
      console.error(error);
    },
    debouncedDelay: 1000,
    disabled: !!projectError || !project,
  });

  if (projectError) {
    return <div>ERROR</div>;
  }

  if (!project) {
    return <div>LOADING</div>;
  }

  const handleSubmit = async () => {
    type ModalPostAnnouncement$ModalResult =
      | { type: "cancel" }
      | { type: "continue"; value: ProjectCommunityUpdate }
      | { type: "skip" };

    const modalPostAnnouncement$modalResult =
      await showModal<ModalPostAnnouncement$ModalResult>((resolve) => (
        <ModalPostAnnouncement
          open
          projectId={projectId}
          projectTiers={project.tiers ?? []}
          labelAction="Continue"
          onAction={(value) => resolve({ type: "continue", value })}
          onExit={() => resolve({ type: "cancel" })}
          onSkip={() => resolve({ type: "skip" })}
        />
      ));

    if (modalPostAnnouncement$modalResult.type === "cancel") {
      return;
    }

    const projectCommunityUpdate =
      modalPostAnnouncement$modalResult.type === "continue"
        ? modalPostAnnouncement$modalResult.value
        : newProjectAnnouncement();

    type ModalUpdateProject$ModalResult = "cancel" | "success";

    const modalUpdateProject$ModalResult =
      await showModal<ModalUpdateProject$ModalResult>((resolve) => (
        <ModalUpdateProject
          open
          projectId={projectId}
          project={project}
          initialAnnouncement={projectCommunityUpdate}
          initialShouldPostAnnouncement={
            modalPostAnnouncement$modalResult.type === "continue"
          }
          onCancel={() => resolve("cancel")}
          onSuccess={() => resolve("success")}
        />
      ));

    if (modalUpdateProject$ModalResult === "cancel") {
      return;
    }

    await showModal((resolve) => (
      <ModalProjectUpdatedSuccessfully
        open
        onClose={() => resolve(undefined)}
      />
    ));

    router.push(`/k/${project.basics.customUrl}`);
  };

  return (
    <>
      <TeikiHead />
      <div className={cx(styles.container, className)} style={style}>
        <ProjectEditor
          key={projectId}
          value={project}
          onChange={setProject}
          projectId={projectId}
          statusText={formatAutoSaverStatus(autoSaveStatus)}
          onPreview={() => {
            window.open("preview", "_blank", "noopener,noreferrer");
          }}
          onClickSubmit={() => void handleSubmit()}
          onExit={() => {
            if (autoSaveStatus !== "idle" && autoSaveStatus !== "success") {
              const ok = confirm(
                "Are you sure you want to leave? Changes you made may not be saved."
              );
              if (!ok) return;
            }
            router.push("/");
          }}
        />
      </div>
    </>
  );
}
