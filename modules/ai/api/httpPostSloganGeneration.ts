import { assert } from "@/modules/common-utils";

type Params = {
  baseUrl: string;
  text: string;
};

type Response = {
  slogans: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    Array.isArray(obj?.slogans) &&
    ["string", "undefined"].includes(typeof obj?.slogans?.[0])
  );
}

export async function httpPostSloganGeneration({
  baseUrl,
  text,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/slogan-generation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ text }),
  });
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}
