import { assert } from "@/modules/common-utils";
import { toJson } from "@/modules/json-utils";

type LogoCid = string;

type Params = {
  letter: string;
  keywords: string[];
};

type Response = {
  logos: LogoCid[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj?: any): obj is Response {
  return (
    Array.isArray(obj?.logos) &&
    ["string", "undefined"].includes(typeof obj?.logos?.[0])
  );
}

export async function httpPostBlazinglyFastLogos({
  letter,
  keywords,
}: Params): Promise<Response> {
  const response = await fetch(`/api/v1/logos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: toJson({ letter, keywords }),
  });
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}
