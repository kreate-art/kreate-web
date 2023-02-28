import { WithdrawalStatus } from "./types";

export const WITHDRAWAL_STATUS_TO_TEXT: Record<WithdrawalStatus, string> = {
  "in-progress": "In Progress",
  done: "Done",
};
