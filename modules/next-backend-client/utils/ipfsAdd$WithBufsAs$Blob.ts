import { httpPostIpfsAdd } from "../api/httpPostIpfsAdd";

import { toJsonStable } from "@/modules/json-utils";
import {
  mapBufsAsync,
  mapValuesAsync,
  WithBufsAs,
} from "@/modules/with-bufs-as";

type Cid = string;

async function blobToCid(blob: Blob): Promise<Cid> {
  const { cid } = await httpPostIpfsAdd(blob);
  return cid;
}

export async function ipfsAdd$WithBufsAs$Blob(
  blobWBA: WithBufsAs<unknown, Blob>
): Promise<Cid> {
  const cidWBA: WithBufsAs<unknown, Cid> = await mapBufsAsync(
    blobWBA,
    async (bufs) =>
      await mapValuesAsync(bufs, async (buf) => await blobToCid(buf))
  );
  return blobToCid(new Blob([toJsonStable(cidWBA)]));
}
