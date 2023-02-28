import { Address, UnixTime } from "lucid-cardano";
import useSWR from "swr";

import { Podcast } from "@/modules/business-types";
import { httpGetAllPodcasts } from "@/modules/next-backend-client/api/httpGetAllPodcasts";

export type Params = {
  backedBy?: Address;
  createdSince?: UnixTime;
  createdBefore?: UnixTime;
};

export type Result =
  | { error: null; data: { podcasts: Podcast[] } }
  | { error: "fetch-error"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export function useAllPodcasts({
  backedBy,
  createdSince,
  createdBefore,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    [
      "38022976-8283-4bee-a85b-be86f9782bfa",
      backedBy,
      createdSince,
      createdBefore,
    ],
    async () =>
      await httpGetAllPodcasts({ backedBy, createdSince, createdBefore })
  );
  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  return { error: null, data: { podcasts: data.podcasts } };
}
