import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { TxParams$CreatorCloseProject } from "@/modules/next-backend/logic/getCreatorCloseProject";

export type TxParams$CreatorCloseProject$Response = {
  error: undefined;
  txParams: TxParams$CreatorCloseProject;
};

export async function httpGetTxParams$CreatorCloseProject({
  projectId,
}: {
  projectId: string;
}): Promise<TxParams$CreatorCloseProject$Response> {
  const search = new URLSearchParams({ projectId });
  const response = await fetch(
    `/api/v1/tx-params/creator-close-project?${search.toString()}`
  );

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$CreatorCloseProject$Response {
  return (
    obj?.error === undefined &&
    obj?.txParams &&
    typeof obj?.txParams === "object"
  );
}
