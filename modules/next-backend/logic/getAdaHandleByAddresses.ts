import { Address } from "lucid-cardano";

import { assert } from "@/modules/common-utils";
import type { Redis } from "@/modules/next-backend/connections";

export type AdaHandle = string;

export type Params = {
  addresses: Address[];
};

type Response = { [address: string]: AdaHandle[] };

const ADDRESS_TO_HANDLES_PREFIX = "s:ah.";

export async function getAdaHandleByAddresses(
  redis: Redis,
  { addresses }: Params
): Promise<Response> {
  if (addresses.length === 0) return {};
  else if (addresses.length === 1) {
    const [address] = addresses;
    return {
      [address]: await redis.smembers(ADDRESS_TO_HANDLES_PREFIX + address),
    };
  } else {
    const pipeline = addresses.reduce(
      (pipeline, address) =>
        pipeline.smembers(ADDRESS_TO_HANDLES_PREFIX + address),
      redis.pipeline()
    );

    const replies = await pipeline.exec();
    assert(replies, "Pipeline error: replies must not be null");

    return Object.fromEntries(
      replies.map(([error, result], index) => {
        const address = addresses[index].toString();
        if (error)
          throw new Error(
            `Unable to retrieve ADA handle for address: ${address}`,
            { cause: error }
          );
        assert(
          Array.isArray(result),
          `Result must be an array for address: ${address}`
        );
        return [address, result];
      })
    );
  }
}
