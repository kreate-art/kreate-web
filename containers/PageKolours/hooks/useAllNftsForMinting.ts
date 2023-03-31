import useSWR from "swr";

import {
  HttpGetAllNftsForMinting$Response,
  httpGetAllNftsForMinting,
} from "../api/httpGetAllNftsMinting";

import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

export function useAllNftsForMinting(): [
  HttpGetAllNftsForMinting$Response | undefined,
  unknown
] {
  const { walletStatus } = useAppContextValue$Consumer();

  const address =
    walletStatus.status === "connected" ? walletStatus.info.address : undefined;

  const { data, error } = useSWR(
    ["4831891d-eee4-46ef-8b34-9d9cf7292874", address],
    async () => await httpGetAllNftsForMinting({ address })
  );
  return [data, error];
}
