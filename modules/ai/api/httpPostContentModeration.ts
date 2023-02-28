import { assert } from "@/modules/common-utils";

type Params = { baseUrl: string; text: string };

type Response = { tags: string[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.tags);
}

export async function httpPostContentModeration({
  baseUrl,
  text,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/ai-content-moderation`, {
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

  // @sk-umiuma: we temporarily filter out these tags
  // as the returning verdict of these tags is unreliable
  const unstableTags = ["political", "drug", "discrimination"];
  return { tags: data.tags.filter((tag) => !unstableTags.includes(tag)) };
}
