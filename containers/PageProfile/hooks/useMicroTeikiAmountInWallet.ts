import { toUnit } from "lucid-cardano";
import useSWR from "swr";

import {
  NEXT_PUBLIC_TEIKI_ASSET_NAME,
  NEXT_PUBLIC_TEIKI_MPH,
} from "../../../config/client";

import { isNotNullOrUndefined } from "@/modules/array-utils";
import { sumLovelaceAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { toJson } from "@/modules/json-utils";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

export function useMicroTeikiAmountInWallet(): [
  LovelaceAmount | undefined,
  DisplayableError | undefined
] {
  const { walletStatus } = useAppContextValue$Consumer();

  const { data, error } = useSWR(
    [
      "46f88f9c-3561-4f98-9757-f4109e1a6c85",
      walletStatus.status === "connected"
        ? toJson(walletStatus.info)
        : walletStatus.status,
    ],
    async () => {
      if (walletStatus.status !== "connected") return undefined;
      const utxos = await walletStatus.lucid.wallet.getUtxos();
      const unit = toUnit(NEXT_PUBLIC_TEIKI_MPH, NEXT_PUBLIC_TEIKI_ASSET_NAME);
      const coins = utxos
        .map((utxo) => utxo.assets[unit])
        .filter(isNotNullOrUndefined);
      return sumLovelaceAmount(coins);
    },
    { refreshInterval: 60000 }
  );

  const displayableError = error
    ? DisplayableError.from(error, "Cannot fetch Teiki balance")
    : undefined;

  return [data, displayableError];
}
