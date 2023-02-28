import { get, set, keys, del } from "idb-keyval";

import { assert } from "@/modules/common-utils";
import { mapEachBufAsync, WithBufsAs } from "@/modules/with-bufs-as";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWithBufsAs<T, V>(obj: any): obj is WithBufsAs<T, V> {
  return typeof obj?.data === "object" && typeof obj?.bufs === "object";
}

export async function save(
  storageId: string,
  wbaBlob: WithBufsAs<unknown, Blob>
): Promise<void> {
  const existedKeys = await keys();
  const wbaNull = await mapEachBufAsync(wbaBlob, async (buf, sha256) => {
    if (!existedKeys.includes(sha256)) {
      await set("blob+sha256:" + sha256, buf);
    }
    return null;
  });
  await set(storageId, wbaNull);
}

export async function load(
  storageId: string
): Promise<WithBufsAs<unknown, Blob>> {
  const wbaNull = await get(storageId);
  assert(isWithBufsAs(wbaNull), "object not found or is not WithBufsAs");
  return mapEachBufAsync(
    wbaNull,
    async (_, sha256) => (await get("blob+sha256:" + sha256)) as Blob
  );
}

export async function clear(storageId: string) {
  await del(storageId);
}
