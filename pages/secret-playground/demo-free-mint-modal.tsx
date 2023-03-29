import ModalFreeMintKolour from "../../containers/PageKolours/containers/ModalFreeMintKolour";

import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const kolours = ["3A521A", "9D529F"]; // "9D529F" has been minted!
  const { showModal } = useModalPromises();

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal((resolve) => (
          <ModalFreeMintKolour
            open
            source={{ type: "free" }}
            kolours={kolours}
            onCancel={() => resolve({ type: "cancel" })}
            onSuccess={(txHash, quotation) =>
              resolve({
                type: "success",
                variant: "kolour",
                txHash,
                quotation,
              })
            }
          />
        ));
      }}
    />
  );
}
