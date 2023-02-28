import React from "react";

import ModalUpdateProject from "../../containers/PageUpdateProjectV2/containers/ModalUpdateProject";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import {
  generateProject,
  generateProjectCommunityUpdate,
} from "@/modules/data-faker";
import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();
  const project = useComputationOnMount(() => generateProject());
  const projectCommunityUpdate = useComputationOnMount(() =>
    generateProjectCommunityUpdate()
  );

  if (!project || !projectCommunityUpdate) return null;

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal((resolve) => (
          <ModalUpdateProject
            open
            projectId={
              "29ea395672ac5db2970d2baeaad27245a973be0bcfbfab8ef5f7d18c4bb3bda6"
            }
            project={project}
            initialAnnouncement={projectCommunityUpdate}
            initialShouldPostAnnouncement={false}
            onCancel={() => resolve(undefined)}
            onSuccess={() => resolve(undefined)}
          />
        ));
      }}
    />
  );
}
