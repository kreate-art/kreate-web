import useSWR from "swr";

import {
  httpGetAllMintedKolours,
  HttpGetAllMintedKolours$Response,
} from "../api/httpGetAllMintedKolours";

export function useAllMintedKolours(): [
  HttpGetAllMintedKolours$Response | undefined,
  unknown
] {
  const { data, error } = useSWR(
    ["5d03afdb-19c0-4126-bcb6-3fb0f45968b1"],
    async () => await httpGetAllMintedKolours()
  );
  return [data, error];
}
