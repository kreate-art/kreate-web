import useSWR from "swr";

import { httpGetMintedKolour } from "../api/httpGetMintedKolour";

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
    async () => await httpGetMintedKolour({ kolour })
  );
  return [data, error];
}
