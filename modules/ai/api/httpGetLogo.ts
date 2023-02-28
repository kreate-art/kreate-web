import { assert } from "@/modules/common-utils";

type LogoId = string;

type Params = {
  baseUrl: string;
  logoId: LogoId;
};

type Response = Blob;

export async function httpGetLogo({
  baseUrl,
  logoId,
}: Params): Promise<Response> {
  let response = await fetch(`${baseUrl}/get-logo/${logoId}`);

  // HACK: currently, there is a bug from our AI service which requires
  // an underscore character in front of the logo id.
  // Remove this line when our AI service is fixed.
  response = response.ok
    ? response
    : await fetch(`${baseUrl}/get-logo/_${logoId}`);

  assert(response.ok, "response not ok");
  return await response.blob();
}
