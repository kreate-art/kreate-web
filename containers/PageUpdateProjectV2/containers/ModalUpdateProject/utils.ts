import moment from "moment";

import { UnixTimestamp } from "@/modules/business-types";

const DAY_IN_MS = 86400000;

export function formatTimespanToExpiryDate(
  currentTimestamp: UnixTimestamp,
  expiryTimestamp: UnixTimestamp
): string {
  const diff = moment(expiryTimestamp).diff(moment(currentTimestamp));
  if (diff <= 0) return "Expired";
  if (diff <= DAY_IN_MS) return "Expires in a day";
  return `Expires in ${Math.ceil(diff / DAY_IN_MS)} days`;
}
