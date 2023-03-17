import { fromJson } from "@kreate/protocol/json";

import { assert } from "@/modules/common-utils";
import { TxParams$BackerUnbackProject } from "@/modules/next-backend/logic/getBackerUnbackProject";

export type ProjectStatus =
  | "active"
  | "pre-closed"
  | "pre-delisted"
  | "closed"
  | "delisted";

type Params = {
  projectStatus?: ProjectStatus;
  backerAddress: string;
  projectId: string;
  legacy?: boolean;
};

type Response = {
  error: undefined;
  txParams: TxParams$BackerUnbackProject;
};

export type TxParams$BackerUnbackProject$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.error === undefined &&
    obj?.txParams &&
    typeof obj?.txParams === "object"
  );
}

export async function httpGetTxParams$BackerUnbackProject({
  projectStatus,
  backerAddress,
  projectId,
  legacy,
}: Params): Promise<Response> {
  const params = new URLSearchParams();
  params.append("projectId", projectId);
  params.append("backerAddress", backerAddress);
  if (legacy) params.append("legacy", "1");
  if (projectStatus === "closed" || projectStatus === "delisted")
    params.append("active", "false");
  const url = `/api/v1/tx-params/backer-unback-project?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body, { forceBigInt: true });
  assert(isResponse(data), "invalid response");

  return data;
}
