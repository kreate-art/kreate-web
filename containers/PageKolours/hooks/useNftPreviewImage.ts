import useSWR from "swr";

import { httpGetNftPreviewImage } from "../api/httpGetNftPreviewImage";

import { Kolours } from "@/modules/kolours/types";

export function useNftPreviewImage(
  genesisKreation: Kolours.GenesisKreation$Mint
): [string | undefined, unknown] {
  const { data, error } = useSWR(
    ["af47040c-e621-4851-8778-54e3d1cd4909", genesisKreation.id],
    async () => {
      if (genesisKreation.status !== "unready")
        return genesisKreation.finalImage.src;

      const mintedLayers = genesisKreation.palette
        .map<[Kolours.Layer, number]>((layer, i) => [layer, i + 1])
        .filter(([layer, _]) => layer.status === "minted")
        .map(([_, i]) => i);
      if (mintedLayers.length === 0) return genesisKreation.initialImage.src;

      const { url } = await httpGetNftPreviewImage({
        layers: mintedLayers,
        genesisKreationSlug: genesisKreation.slug,
      });

      return url;
    }
  );

  return [data, error];
}
