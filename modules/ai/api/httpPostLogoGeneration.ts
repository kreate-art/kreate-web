import { assert } from "@/modules/common-utils";

type LogoId = string;

type Params = {
  baseUrl: string;
  character: string;
  keywords: string[] | string;
};

type Response = {
  logos: LogoId[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj?: any): obj is Response {
  return (
    Array.isArray(obj?.logos) &&
    ["string", "undefined"].includes(typeof obj?.logos?.[0])
  );
}

export async function httpPostLogoGeneration({
  baseUrl,
  character,
  keywords,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/logo-generation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: character,
      keyword: JSON.stringify(keywords),
    }),
  });
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");
  return data;
}
