import React from "react";

import ModalMintGenesisKreation from "../../containers/PageKolours/containers/ModalMintGenesisKreation";

import { GenesisKreationEntry } from "@/modules/kolours/types/Kolours";
import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();

  const value: GenesisKreationEntry = {
    id: "Genesis Kreation #02",
    status: "unready",
    initialImage: {
      src: "https://ipfs.testnet.kreate.community/ipfs/QmTdjyvLTBUdrdejGu9AbBNXFzuaNJGLP6tt2xQVvp9RMk",
    },
    finalImage: {
      src: "https://ipfs.testnet.kreate.community/ipfs/QmRpzGcbXHt54Voyq2ezDh2api482dd4J8Hiizj7bgQHig",
    },
    fee: 3500000000,
    listedFee: 7000000000,
    palette: [
      {
        kolour: "0E212D",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmZ3GrK6A8N9SVTpHB92uqbR3ZjZC53Vp6QMC1H8vwERQF",
        },
        status: "free",
        fee: 7016522,
        listedFee: 14033045,
      },
      {
        kolour: "7C97A3",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmbMZJXjBt83UW7s62RdcctSaHsUC4Bx6vMNg53X73BWK5",
        },
        status: "free",
        fee: 62075581,
        listedFee: 124151163,
      },
      {
        kolour: "213E4E",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmR4nt41gtSZKt79FSjSXdTQV5Xh2BxAXGerptgchESXxt",
        },
        status: "free",
        fee: 16531039,
        listedFee: 33062078,
      },
      {
        kolour: "010202",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmYd9XbNiBtYeA3UALvBKHVAopRJv7bJ6CNxqBdCMFVkMZ",
        },
        status: "free",
        fee: 2000000,
        listedFee: 4000000,
      },
      {
        kolour: "537C8D",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmRpAmCQqJFBQFP3UxUjS58jyvx6vJwVtBFxV6KscvDwKG",
        },
        status: "free",
        fee: 41562070,
        listedFee: 83124141,
      },
      {
        kolour: "3A5C6B",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmU7cbknkdjLLemFBs88USk89uSL6iQrs3jcbLpQQjAMvG",
        },
        status: "free",
        fee: 29046053,
        listedFee: 58092107,
      },
      {
        kolour: "A5BBC4",
        image: {
          src: "https://ipfs.testnet.kreate.community/ipfs/QmTVq93q37u2seoxBnMekC6zieBz47DKB8Xc6fy8xFfGdJ",
        },
        status: "free",
        fee: 82593598,
        listedFee: 165187196,
      },
    ],
    createdAt: 1679645300010,
  };

  return (
    <Button.Solid
      content="Show Modal"
      onClick={() => {
        void showModal((resolve) => (
          <ModalMintGenesisKreation
            open
            genesisKreation={value}
            onCancel={() => resolve({ type: "cancel" })}
            onSuccess={(event) => resolve({ type: "success", event })}
          />
        ));
      }}
    />
  );
}
