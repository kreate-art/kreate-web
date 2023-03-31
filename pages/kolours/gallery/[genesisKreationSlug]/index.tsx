import { GetServerSideProps } from "next";

import PageKoloursGalleryDetails from "../../../../containers/PageKoloursGalleryDetails";

import { getAllGenesisKreationsForGallery } from "@/modules/kolours/genesis-kreation";
import { GenesisKreation$Gallery } from "@/modules/kolours/types/Kolours";
import { db } from "@/modules/next-backend/connections";

type Props = {
  gkEntry: GenesisKreation$Gallery;
};

export default function RouteToPageGenesisKreationNFTDetails({
  gkEntry,
}: Props) {
  return <PageKoloursGalleryDetails value={gkEntry} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const gkNftSlug = context.params?.["genesisKreationSlug"];
  if (typeof gkNftSlug !== "string" || !/^[ -~]+$/.test(gkNftSlug))
    return {
      notFound: true,
    };

  const allGenesisKreations = await getAllGenesisKreationsForGallery(db);
  // TODO: We might want to have a seperated endpoint, but the
  // genesis kreation size is still relatively small for now.
  const genesisKreation = allGenesisKreations.filter(
    (value) => value.slug === gkNftSlug
  );

  if (genesisKreation.length === 0) {
    return {
      notFound: true,
    };
  }

  if (genesisKreation.length > 1) {
    console.warn("Having 2 genesis kreation NFTs with the same ID");
  }

  return {
    props: {
      gkEntry: genesisKreation[0],
    },
  };
};
