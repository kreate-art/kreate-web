import useSWR from "swr";

import { httpGetTxParams$CreatorCloseProject } from "../api/httpGetTxParams$CreatorCloseProject";

import { TxParams$CreatorCloseProject } from "@/modules/next-backend/logic/getCreatorCloseProject";

type Params = {
  projectId: string;
};

type Result =
  | { error: null; data: { txParams: TxParams$CreatorCloseProject } }
  | { error: "fetch-failed"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseTxParams$CreatorCloseProject$Result = Result;

export function useTxParams$CreatorCloseProject({
  projectId,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["f893e636-ce31-4a89-bf62-44a922e9fd6f"],
    async () => await httpGetTxParams$CreatorCloseProject({ projectId })
  );

  if (error) {
    return { error: "fetch-failed", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  return {
    error: null,
    data: { txParams: data.txParams },
  };
}
