import React from "react";

import ModalMintKolour from "../../containers/PageKolours/containers/ModalMintKolour";

import { Layer } from "@/modules/kolours/types/Kolours";
import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();

  const kolours: Layer[] = [
    {
      kolour: "CCB981",
      image: {
        src: "https://ipfs.testnet.kreate.community/ipfs/QmVHnNoSe1gePJZb3ybN3UKJRAbMBSmMgrND2iMGqui14P",
      },
      status: "free",
      fee: 2518000,
      listedFee: 2518000,
    },
    {
      kolour: "A7995A",
      image: {
        src: "https://ipfs.testnet.kreate.community/ipfs/Qma1zYtTRXqquhHagB8wY2XhoLe7F7cQceFL76rw18cFsh",
      },
      status: "free",
      fee: 2410000,
      listedFee: 2410000,
    },
    {
      kolour: "555634",
      image: {
        src: "https://ipfs.testnet.kreate.community/ipfs/Qma5F9LzQpnYPZ4PPHBS5xBrzsrvfk5Z7sNa7My9vsZuAS",
      },
      status: "free",
      fee: 2223000,
      listedFee: 2223000,
    },
  ];

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal((resolve) => (
          <ModalMintKolour
            open
            kolours={kolours}
            onCancel={() => resolve({ type: "cancel" })}
            onSuccess={(event) => resolve({ type: "success", event })}
          />
        ));
      }}
    />
  );
}
