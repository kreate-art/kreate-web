import useSWR from "swr";

import {
  httpGetAllNftsForGallery,
  HttpGetAllNftsForGallery$Response,
} from "../api/httpGetAllNftsGallery";

import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

export function useAllNftsForGallery(): [
  HttpGetAllNftsForGallery$Response | undefined,
  unknown
] {
  const { walletStatus } = useAppContextValue$Consumer();

  const address =
    walletStatus.status === "connected" ? walletStatus.info.address : undefined;

  const { data, error } = useSWR(
    ["bd4ccfa9-388f-4827-baec-bcdc03d3b2dc", address],
    async () => await httpGetAllNftsForGallery()
  );
  return [data, error];
}
