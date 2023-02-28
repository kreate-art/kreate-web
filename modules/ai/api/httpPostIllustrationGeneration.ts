import { assert } from "@/modules/common-utils";

type IllustrationId = string;

type Params = {
  baseUrl: string;
  keywords: string[] | string;
};

type Response = {
  illustrations: IllustrationId[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    Array.isArray(obj?.illustrations) &&
    ["string", "undefined"].includes(typeof obj?.illustrations?.[0])
  );
}

/**
 * Sends a POST request to the AI service to generate cover images.
 *
 * The response contains a list of illustration ids, which are the keys
 * to fetch the resulted cover images. Note that the process takes time.
 * Therefore, when we use these keys to query the AI service, the server
 * will reply with status 404 in the first few tries.
 */
export async function httpPostIllustrationGeneration({
  baseUrl,
  keywords,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/illustration-generation`, {
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
