import {
  Address,
  DetailedProject,
  LovelaceAmount,
  MicroTeikiAmount,
} from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { fromJson } from "@/modules/json-utils";

type Params = {
  address: Address;
};

type DetailedBackedProject = {
  project: DetailedProject;
  handle?: string;
  numLovelacesBacked: LovelaceAmount;
  numMicroTeikisUnclaimed: MicroTeikiAmount;
  isCurrentlyBacking: boolean;
};

export type HttpGetUser$DetailedBackedProject = DetailedBackedProject;

type Response = {
  ownProject: DetailedProject[];
  backedProjects: DetailedBackedProject[];
};

export type HttpGetUser$Response = Response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResponse(obj: any): obj is Response {
  return (
    Array.isArray(obj?.ownProject) &&
    Array.isArray(obj?.backedProjects) &&
    obj.backedProjects.slice(0, 1).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) =>
        typeof item?.project === "object" &&
        ["number", "bigint"].includes(typeof item?.numLovelacesBacked) &&
        ["number", "bigint"].includes(typeof item?.numMicroTeikisUnclaimed)
    )
  );
}

export async function httpGetUser({ address }: Params): Promise<Response> {
  const search = new URLSearchParams();
  search.append("address", address);
  const response = await fetch(`/api/v1/user?${search.toString()}`);
  assert(response.ok, "response not ok");
  const body = await response.text();
  const data = fromJson(body);
  assert(isResponse(data), "invalid response");
  return data;
}
