import { C, Lucid } from "lucid-cardano";

import { MINIMUM_BACKING_AMOUNT, PADDING_LOVELACE_AMOUNT } from "../constants";

import { LovelaceAmount } from "@/modules/business-types";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { toJson } from "@/modules/json-utils";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type BigNum = ReturnType<typeof C.BigNum.zero>;

function toBigNum(amount: LovelaceAmount): BigNum {
  return C.BigNum.from_str(BigInt(amount).toString());
}

function fromBigNum(amount: BigNum): LovelaceAmount {
  return BigInt(amount.to_str());
}

async function getMaxLovelaceAmount(lucid: Lucid): Promise<LovelaceAmount> {
  const [protocolParameters, utxos] = await Promise.all([
    lucid.provider.getProtocolParameters(),
    lucid.wallet.getUtxosCore(),
  ]);
  const coinsPerUtxoByte = toBigNum(protocolParameters.coinsPerUtxoByte);

  // 1. Initialize result = 0
  let result = C.BigNum.zero();

  // 2. For each UTXO in the user wallet,
  // result = result + lovelace amount - lovelace amount locked by assets
  for (let i = 0; i < utxos.len(); i++) {
    const output = utxos.get(i).output();
    const totalAda = output.amount().coin();
    const minAda = C.min_ada_required(output, coinsPerUtxoByte);
    result = result.checked_add(totalAda).checked_sub(minAda);
  }

  // 3. result = max(0, result - padding lovelace amount)
  result = result.clamped_sub(toBigNum(PADDING_LOVELACE_AMOUNT));

  // 4. If result < minimum backing amount, return 0. Else, returns result
  return result.compare(toBigNum(MINIMUM_BACKING_AMOUNT)) < 0
    ? 0
    : fromBigNum(result);
}

export function useMaxLovelaceAmount() {
  const { walletStatus } = useAppContextValue$Consumer();

  return useMemo$Async(
    async () => {
      if (walletStatus.status !== "connected") return undefined;
      return await getMaxLovelaceAmount(walletStatus.lucid);
    },
    { debouncedDelay: 1000 },
    [
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
    ]
  );
}
