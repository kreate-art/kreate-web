import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";
import {
  GenesisKreation$Mint,
  GenesisKreationSlug,
} from "@/modules/kolours/types/Kolours";

type Params = {
  genesisKreationSlug: GenesisKreationSlug;
  layers: number[];
};

type Response = {
  url: string;
};

export type HttpGetNftPreviewImage$Response = Response;
export type HttpGetNftPreviewImage$Params = Params;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return typeof obj?.url === "string";
}

export async function httpGetNftPreviewImage({
  genesisKreationSlug,
  layers,
}: Params): Promise<Response> {
  const search = new URLSearchParams();
  search.append("slug", genesisKreationSlug);
  search.append("layers", layers.join(","));

  const response = await fetch(
    `/api/kolours/genesis-kreation/preview?${search}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = await fromJson(body);
  assert(isResponse(data), "invalid data");
  return data;
}
