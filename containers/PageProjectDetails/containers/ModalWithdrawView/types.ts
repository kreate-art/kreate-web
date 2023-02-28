export type Stage =
  | "enter-amount"
  | "withdrawal-in-progress"
  | "view-withdrawals";

export type UnixTimestamp = number;

export type Withdrawal = {
  createdAt: UnixTimestamp;
  numLovelaceWithdrawn: number | bigint;
  status: WithdrawalStatus;
};

export type WithdrawalList = {
  withdrawals: Withdrawal[];
};

export type WithdrawalStatus = "in-progress" | "done";
