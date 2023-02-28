import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { TxParams$CreatorCreateProject$Response } from "@/modules/next-backend/logic/getCreatorCreateProject";

export async function httpGetTxParams$CreatorCreateProject(): Promise<TxParams$CreatorCreateProject$Response> {
  const response = await fetch("/api/v1/tx-params/creator-create-project");

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$CreatorCreateProject$Response {
  return !!obj?.protocolParamsUtxo && !!obj?.projectAtScriptReferenceUtxo;
}
