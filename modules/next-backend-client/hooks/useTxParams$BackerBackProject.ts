import useSWR from "swr";

import { httpGetTxParams$BackerBackProject } from "../api/httpGetTxParams$BackerBackProject";

import { TxParams$BackerBackProject } from "@/modules/next-backend/logic/getBackerBackProject";

type Params = {
  projectId: string;
};

type Result =
  | {
      error: null;
      data: { txParams: TxParams$BackerBackProject };
    }
  | { error: "fetch-error"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseTxParams$BackerBackProject$Result = Result;

export function useTxParams$BackerBackProject({
  projectId,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["972d6f35-2669-4ffe-836c-3c6888121e88", projectId],
    async () => await httpGetTxParams$BackerBackProject({ projectId })
  );

  if (error) {
    return { error: "fetch-error", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  return { error: null, data: { txParams: data.txParams } };
}
