import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

export type Cid = string;

type Response = { cid: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return obj?.cid && typeof obj.cid === "string";
}

export async function httpPostIpfsAdd(buf: Blob): Promise<Response> {
  const formData = new FormData();
  formData.append("data", buf);

  const response = await fetch("/api/v1/ipfs/add", {
    method: "POST",
    body: formData,
  });

  assert(response.ok, "response not ok");
  const body = await response.text();
  const responseData = fromJson(body);
  assert(isResponse(responseData), "invalid response");

  return responseData;
}
