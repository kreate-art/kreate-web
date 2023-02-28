import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { TxParams$BackerBackProject } from "@/modules/next-backend/logic/getBackerBackProject";

export type TxParams$BackerBackProject$Response = {
  error: undefined;
  txParams: TxParams$BackerBackProject;
};

export async function httpGetTxParams$BackerBackProject({
  projectId,
}: {
  projectId: string;
}): Promise<TxParams$BackerBackProject$Response> {
  const search = new URLSearchParams();
  search.append("projectId", projectId);
  const url = `/api/v1/tx-params/backer-back-project?${search.toString()}`;
  const response = await fetch(url);

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$BackerBackProject$Response {
  return obj?.error === undefined && typeof obj?.txParams === "object";
}
