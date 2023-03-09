import { httpGetLatestBlock } from "./api/httpGetLatestBlock";
import { TX_TIME_START_PADDING } from "./constants";

import { UnixTimestamp } from "@/modules/business-types";
import { writeErrorToConsole } from "@/modules/displayable-error";

export async function getTxTimeStart(): Promise<UnixTimestamp> {
  try {
    const response = await httpGetLatestBlock();
    return response.time * 1000;
  } catch (error) {
    writeErrorToConsole(error);
    const now = Math.floor(Date.now() / 1000) * 1000;
    return now - TX_TIME_START_PADDING;
  }
}

// NOTE: @sk-kitsune: in the future, we will deprecate this function and
// use getTxTimeStart directly
export async function getTxTimeStartPadding(): Promise<number> {
  const padding = Date.now() - (await getTxTimeStart());
  // this is how ouroboros works
  return Math.ceil(padding / 1000) * 1000;
}
