import { assert } from "@/modules/common-utils";

type IllustrationId = string;

type Params = {
  baseUrl: string;
  illustrationId: IllustrationId;
};

type Response = Blob;

export async function httpGetIllustration({
  baseUrl,
  illustrationId,
}: Params): Promise<Response> {
  const response = await fetch(`${baseUrl}/get-illustration/${illustrationId}`);
  assert(response.ok, "response not ok");
  return await response.blob();
}
