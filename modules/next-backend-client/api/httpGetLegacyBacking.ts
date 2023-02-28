import { Address } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import { LegacyBackingInfoByBacker } from "@/modules/next-backend/logic-legacy/getLegacyBackingInfoByBackerAddress";

type Params = {
  backerAddress: Address;
};

type Response =
  | { error: undefined; backingInfo: LegacyBackingInfoByBacker[] }
  | { error: 59; _debug: unknown /* not found */ };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  if (obj?.error === 59) return true;
  return (
    obj?.error === undefined &&
    Array.isArray(obj?.backingInfo) &&
    obj.backingInfo.every(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) =>
        typeof item?.newProjectId === "string" &&
        typeof item?.project === "object" &&
        typeof item?.backingAmount === "number"
    )
  );
}

export async function httpGetLegacyBacking({
  backerAddress,
}: Params): Promise<Response> {
  const search = new URLSearchParams();
  search.append("backerAddress", backerAddress);
  const response = await fetch(`/api/v1/legacy-backing?${search.toString()}`);
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");

  return data;
}
