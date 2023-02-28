import { assert } from "@/modules/common-utils";

type Params = {
  baseUrl: string;
  keywords: string[];
};

type Response = {
  list_name: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj?: any): obj is Response {
  return (
    Array.isArray(obj?.list_name) &&
    ["string", "undefined"].includes(typeof obj?.list_name?.[0])
  );
}

export async function httpPostNameGeneration({
  baseUrl,
  keywords,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/name-generation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      keyword: JSON.stringify(keywords),
    }),
  });
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}
