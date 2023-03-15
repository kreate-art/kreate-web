import { httpGetAdaHandle } from "@/modules/next-backend-client/api/httpGetAdaHandle";

const ADA_HANDLE_REFRESH_INTERVAL = 200;
const BATCH_LIMIT = 16;

type QueueItem = {
  resolve: (handle: string) => void;
  address: string;
};

const queue: QueueItem[] = [];
const handles: Map<string, string> = new Map();

function scheduleExecution() {
  setTimeout(() => {
    run();
  }, ADA_HANDLE_REFRESH_INTERVAL);
}

export async function run() {
  const itemsToExecute = queue.splice(0, BATCH_LIMIT);
  if (queue.length > 0) {
    scheduleExecution();
  }
  const filteredItems = Array.from(
    new Set(
      itemsToExecute
        .map(({ address }) => address)
        .filter((address) => !handles.has(address))
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
    handles.set(address, handle);
  });
}

export async function getAdaHandle(address: string): Promise<string> {
  const fetchedHandle = handles.get(address);
  if (fetchedHandle) {
    return fetchedHandle;
  }
  const promise: Promise<string> = new Promise((resolve) => {
    queue.push({ resolve, address });
  });
  scheduleExecution();

  return promise;
}
