import useSWR from "swr";

import {
  httpGetTxParams$BackerUnbackProject,
  ProjectStatus,
} from "../api/httpGetTxParams$BackerUnbackProject";

import { Address } from "@/modules/business-types";
import { TxParams$BackerUnbackProject } from "@/modules/next-backend/logic/getBackerUnbackProject";

type Params = {
  projectStatus?: ProjectStatus;
  projectId: string | undefined;
  backerAddress: Address | undefined;
};

type Result =
  | { error: null; data: { txParams: TxParams$BackerUnbackProject } }
  | { error: "fetch-error"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown };

export type UseTxParams$BackerUnbackProject$Result = Result;

export function useTxParams$BackerUnbackProject({
  projectStatus,
  projectId,
  backerAddress,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["8851b6e9-47b9-4154-96ed-e129111425f5", projectId],
    async () => {
      if (projectId == null || backerAddress == null) return undefined;
      return await httpGetTxParams$BackerUnbackProject({
        projectStatus,
        projectId,
        backerAddress,
      });
    }
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
