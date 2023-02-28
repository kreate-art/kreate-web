import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { TxParams$CreatorWithdrawFund } from "@/modules/next-backend/logic/getCreatorWithdrawFund";

export type TxParams$CreatorWithdrawFund$Response = {
  error: undefined;
  txParams: TxParams$CreatorWithdrawFund;
};

export async function httpGetTxParams$CreatorWithdrawFund({
  projectId,
}: {
  projectId: string;
}): Promise<TxParams$CreatorWithdrawFund$Response> {
  const search = new URLSearchParams({ projectId });
  const response = await fetch(
    `/api/v1/tx-params/creator-withdraw-fund?${search.toString()}`
  );

  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is TxParams$CreatorWithdrawFund$Response {
  return (
    obj?.error === undefined &&
    obj?.txParams &&
    typeof obj?.txParams === "object"
  );
}
