import { useRouter } from "next/router";
import * as React from "react";

import { Project } from "../../modules/business-types";

import ModalGroup$CreateProject from "./containers/ModalGroup$CreateProject";
import ProjectEditor from "./containers/ProjectEditor";
import ProjectEditorLandingPage from "./containers/ProjectEditorLandingPage";
import { isNewProject, loadProject, saveProject } from "./utils";

import {
  AUTO_SAVER_STATUS_TO_TEXT,
  useAutoSaver,
} from "@/modules/common-hooks/hooks/useAutoSaver";
import { useConfirmationOnWindowClose } from "@/modules/common-hooks/hooks/useConfirmationOnWindowClose";
import { useState$Async } from "@/modules/common-hooks/hooks/useState$Async";
import { DisplayableError } from "@/modules/displayable-error";
import { useModalPromises } from "@/modules/modal-promises";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";

type Props = {
  storageId: string;
};

/**
 * `PageEditProject` receives a `projectId`, shows the `ProjectEditor`,
 * and handling loading/saving/submitting operations.
 */
export default function PageEditProject({ storageId }: Props) {
  const router = useRouter();
  const { showModal } = useModalPromises();
  const { showMessage } = useToast();
  const [project, setProject, projectError] = useState$Async<Project>(
    async () => await loadProject(storageId),
    []
  );
  const [isLandingPageDismissed, setIsLandingPageDismissed] =
    React.useState(false);

  const autoSaveStatus = useAutoSaver({
    value: project,
    onSave: async (project, signal) => {
      if (!project) return;
      await saveProject(storageId, project, signal);
    },
    onError: (error) => {
      const displayableError = DisplayableError.from(
        error,
        "Failed to save project"
      );
      showMessage({
        title: displayableError.title,
        description: displayableError.description,
        color: "danger",
      });
    },
    debouncedDelay: 1000,
    disabled: !!projectError || !project,
  });

  useConfirmationOnWindowClose(
    autoSaveStatus !== "idle" && autoSaveStatus !== "success"
  );

  const isProjectBlank = project ? isNewProject(project) : undefined;

  React.useEffect(() => {
    if (isProjectBlank === false) {
      setIsLandingPageDismissed(true);
    }
  }, [isProjectBlank]);

  if (projectError) {
    return <div>ERROR</div>; // TODO: show the error screen
  }

  if (!project) {
    return <div>LOADING</div>; // TODO: show the loading screen
  }

  if (isProjectBlank && !isLandingPageDismissed) {
    return (
      <>
        <TeikiHead />
        <ProjectEditorLandingPage
          onClickGetStarted={() => setIsLandingPageDismissed(true)}
        />
      </>
    );
  }

  return (
    <>
      <TeikiHead />
      <ProjectEditor
        key={storageId}
        value={project}
        projectId={null}
        onChange={(project) => setProject(project)}
        statusText={AUTO_SAVER_STATUS_TO_TEXT[autoSaveStatus]}
        onPreview={() =>
          window.open("preview", "_blank", "noopener,noreferrer")
        }
        onClickSubmit={() => {
          void showModal<void>((resolve) => (
            <ModalGroup$CreateProject
              open
              project={project}
              onCancel={resolve}
            />
          ));
        }}
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
    </>
  );
}
