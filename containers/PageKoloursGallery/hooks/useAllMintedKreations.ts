import useSWR from "swr";

import {
  httpGetAllMintedKreations,
  HttpGetAllMintedKreations$Response,
} from "../api/httpGetAllMintedKreations";

export function useAllMintedKreations(): [
  HttpGetAllMintedKreations$Response | undefined,
  unknown
] {
  const { data, error } = useSWR(
    ["2a8f4aa0-5487-4645-9956-72c8dff33c1e"],
    async () => await httpGetAllMintedKreations()
  );
  return [data, error];
}
