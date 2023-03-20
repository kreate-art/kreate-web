import { Address } from "../business-types";

import { httpGetAdaHandle } from "@/modules/next-backend-client/api/httpGetAdaHandle";

const BATCHING_DELAY = 200;
const BATCH_LIMIT = 16;

type QueueItem = {
  resolve: (handle: string) => void;
  address: string;
};

type Handle = string;
const queue: QueueItem[] = [];
const addressToHandle: Map<Address, Handle> = new Map();

function scheduleExecution() {
  setTimeout(() => {
    run();
  }, BATCHING_DELAY);
}

export async function run() {
  const itemsToExecute = queue.splice(0, BATCH_LIMIT);
  if (!itemsToExecute.length) return;
  if (queue.length > 0) {
    scheduleExecution();
  }
  const filteredItems = Array.from(
    new Set(
      itemsToExecute
        .map(({ address }) => address)
        .filter((address) => !addressToHandle.has(address))
    )
  );
  if (filteredItems.length === 0) {
    return;
  }
  const results = await httpGetAdaHandle({
    addresses: filteredItems,
  });
  itemsToExecute.forEach(({ address, resolve }) => {
    const handle =
      results[address].length > 0
        ? `$${results[address][results[address].length - 1]}`
        : address;
    resolve(handle);
    addressToHandle.set(address, handle);
  });
}

export async function getAdaHandle(address: string): Promise<string> {
  const fetchedHandle = addressToHandle.get(address);
  if (fetchedHandle) {
    return fetchedHandle;
  }
  const promise: Promise<string> = new Promise((resolve) => {
    queue.push({ resolve, address });
  });
  scheduleExecution();

  return promise;
}
