import { assert } from "@/modules/common-utils";

type Params = { baseUrl: string; targetTag: string[]; listTags: string[][] };

type Response = { recommend: (number | undefined)[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return Array.isArray(obj?.recommend);
}

export async function httpPostTagsRecommendation({
  baseUrl,
  targetTag,
  listTags,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/recommendation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      target_tag: JSON.stringify(targetTag),
      list_tags: JSON.stringify(listTags),
    }),
  });
  assert(response.ok, "response not ok");
  const data = await response.json();
  assert(isResponse(data), "invalid response");

  if (data.recommend.length !== listTags.length) {
    return {
      recommend: Array.from({ length: listTags.length }, () => undefined),
    };
  }
  return data;
}
