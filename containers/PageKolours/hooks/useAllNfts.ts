import useSWR from "swr";

import { httpGetAllNfts } from "../mock/httpGetAllNfts";

export function useAllNfts() {
  const { data, error } = useSWR(
    ["4831891d-eee4-46ef-8b34-9d9cf7292874"],
    async () => await httpGetAllNfts()
  );
  return [data, error] as const;
}
