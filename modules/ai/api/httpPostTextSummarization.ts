type Params = {
  baseUrl: string;
  text: string;
};

type Response = {
  summary: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj?.summary === "string";
}

export async function httpPostTextSummarization({
  baseUrl,
  text,
}: Params): Promise<Response | undefined> {
  const response = await fetch(`${baseUrl}/text-summarization`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ text }),
  });
  // purposely ignore the error because it is not critical
  if (!response.ok) return undefined;
  const data = await response.json();
  if (!isResponse(data)) return undefined;
  return data;
}
