import { httpGetLatestBlock } from "./api/httpGetLatestBlock";

import { UnixTimestamp } from "@/modules/business-types";
import { writeErrorToConsole } from "@/modules/displayable-error";

const FALLBACK_PADDING = 60000;

export async function getTxTimeStart(): Promise<UnixTimestamp> {
  try {
    const response = await httpGetLatestBlock();
    return response.time * 1000;
  } catch (error) {
    writeErrorToConsole(error);
    const now = Math.floor(Date.now() / 1000) * 1000;
    return now - FALLBACK_PADDING;
  }
}
