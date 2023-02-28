import React from "react";

import ModalMigrateFromLegacy from "../../containers/PageHome/containers/NavBar/containers/ButtonWalletNavbar/containers/ModalMigrateFromLegacy";

import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal<void>((resolve) => (
          <ModalMigrateFromLegacy open onClose={() => resolve()} />
        ));
      }}
    />
  );
}
