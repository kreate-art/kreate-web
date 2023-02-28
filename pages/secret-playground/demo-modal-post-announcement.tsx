import React from "react";

import ModalPostAnnouncement from "../../containers/PageUpdateProjectV2/containers/ModalPostAnnouncement";

import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal((resolve) => (
          <ModalPostAnnouncement
            open
            projectId={
              "29ea395672ac5db2970d2baeaad27245a973be0bcfbfab8ef5f7d18c4bb3bda6"
            }
            labelAction="Continue"
            onAction={() => resolve(undefined)}
            onExit={() => resolve(undefined)}
            onSkip={() => resolve(undefined)}
          />
        ));
      }}
    />
  );
}
