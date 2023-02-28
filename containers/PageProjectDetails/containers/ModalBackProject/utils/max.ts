import { sleep } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";

type Params = {
  walletLovelaceAmount: LovelaceAmount;
};

export async function getMaxLovelaceAmount(
  params: Params
): Promise<LovelaceAmount> {
  // TODO: @sk-kitsune: integrate with the real contract
  await sleep(1000);
  const res = BigInt(params.walletLovelaceAmount) - BigInt(5000000);
  return res > 0 ? res : 0;
}
