import { trimToSlot } from "@kreate/protocol/utils";

import { httpGetLatestBlock } from "./api/httpGetLatestBlock";

import { UnixTimestamp } from "@/modules/business-types";
import { writeErrorToConsole } from "@/modules/displayable-error";

const FALLBACK_PADDING = 60000;

/**
 * Returns the timestamp of the last block. This value is used to determine
 * the validity range. Data is fetched from Blockfrost.
 */
export async function getReferenceTxTime(): Promise<UnixTimestamp> {
  try {
    const response = await httpGetLatestBlock();
    return response.time * 1000;
  } catch (error) {
    writeErrorToConsole(error);
    return trimToSlot(Date.now() - FALLBACK_PADDING);
  }
}
