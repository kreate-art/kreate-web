import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { TxParams$CreatorUpdateProject } from "@/modules/next-backend/logic/getCreatorUpdateProject";

export type TxParams$CreatorUpdateProject$Response = {
  error: undefined;
  txParams: TxParams$CreatorUpdateProject;
};

export async function httpGetTxParams$CreatorUpdateProject({
  projectId,
}: {
  projectId: string;
}): Promise<TxParams$CreatorUpdateProject$Response> {
  const search = new URLSearchParams();
  search.append("projectId", projectId);
  const response = await fetch(
    `/api/v1/tx-params/creator-update-project?${search.toString()}`
  );

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$CreatorUpdateProject$Response {
  return (
    obj?.error === undefined &&
    obj?.txParams &&
    typeof obj?.txParams === "object"
  );
}
