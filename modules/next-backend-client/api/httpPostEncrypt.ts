import { assert } from "@/modules/common-utils";
import { Base64, CipherMeta } from "@/modules/crypt/types";
import { fromJson } from "@/modules/json-utils";

type Response = CipherMeta & { ciphertext: Base64 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return obj?.ciphertext && typeof obj.ciphertext === "string";
}

export async function httpPostEncrypt(buf: string): Promise<Response> {
  const response = await fetch("/api/v1/exclusive/encrypt", {
    method: "POST",
    body: buf,
  });

  assert(response.ok, "response not ok");
  const body = await response.text();
  const responseData: Response = fromJson(body);
  assert(isResponse(responseData), "invalid response");

  return responseData;
}
