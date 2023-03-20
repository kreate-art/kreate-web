import { assert } from "@/modules/common-utils";
import { CipherMeta } from "@/modules/crypt/types";
import { fromJson } from "@/modules/json-utils";
import { Cid } from "@/modules/next-backend/utils/CodecCidCipher";

type Response = CipherMeta & { cid: Cid };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    obj?.cid &&
    typeof obj.cid === "string" &&
    obj?.enc &&
    typeof obj.enc === "string" &&
    obj?.kid &&
    typeof obj.kid === "string" &&
    obj?.iv &&
    typeof obj.iv === "string" &&
    obj?.tag &&
    typeof obj.tag === "string"
  );
}

export async function httpPostEncryptAndPin(buf: Blob): Promise<Response> {
  const formData = new FormData();
  formData.append("data", buf);

  const response = await fetch("/api/v1/exclusive/encrypt/ipfs", {
    method: "POST",
    body: formData,
  });

  assert(response.ok, "response not ok");
  const body = await response.text();
  const responseData = fromJson(body);
  assert(isResponse(responseData), "invalid response");

  return {
    enc: responseData.enc,
    kid: responseData.kid,
    iv: responseData.iv,
    tag: responseData.tag,
    cid: responseData.cid,
  };
}
