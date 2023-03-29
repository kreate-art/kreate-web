import useSWR from "swr";

import { httpGetAllMintedKolours } from "../../PageKoloursGallery/api/httpGetAllMintedKolours";

import { DisplayableError } from "@/modules/displayable-error";
import { Kolour, MintedKolourEntry } from "@/modules/kolours/types/Kolours";

type Params = {
  kolour: Kolour;
};

type Result = { mintedKolour: MintedKolourEntry };

export function useMintedKolour({
  kolour,
}: Params): [Result | undefined, unknown] {
  const { data, error } = useSWR(
    ["161d966f-6726-459d-9493-03ba382b28d0", kolour],
    async (): Promise<Result> => {
      // TODO: @sk-kitsune: This is a quick and dirty way to implement this hook.
      // By right, we have to create a new API instead of fetching all the kolours like this.
      // Feel free to improve this implementation.
      const response = await httpGetAllMintedKolours();
      const mintedKolour = response.kolours.find(
        (mintedKolour) => mintedKolour.kolour === kolour
      );
      DisplayableError.assert(!!mintedKolour, { title: "Kolour not minted" });
      return { mintedKolour };
    }
  );
  return [data, error];
}
