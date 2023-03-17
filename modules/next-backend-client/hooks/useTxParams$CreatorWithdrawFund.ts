import * as S from "@kreate/protocol/schema";
import { ProtocolParamsDatum } from "@kreate/protocol/schema/teiki/protocol";
import useSWR from "swr";

import { httpGetTxParams$CreatorWithdrawFund } from "../api/httpGetTxParams$CreatorWithdrawFund";

import { TxParams$CreatorWithdrawFund } from "@/modules/next-backend/logic/getCreatorWithdrawFund";

type Params = {
  projectId: string;
};

type Result =
  | {
      error: null;
      data: { txParams: TxParams$CreatorWithdrawFund };
      computed: { protocolParams: S.Static<typeof ProtocolParamsDatum> };
    }
  | { error: "fetch-failed"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown }
  | { error: "utxo-invalid"; _debug?: unknown };

export type UseTxParams$CreatorWithdrawFund$Result = Result;

/**
 * Fetches tx params for flow creator-create-project and extracts useful data.
 * Returns the raw response plus the computed data.
 */
export function useTxParams$CreatorWithdrawFund({
  projectId,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["1342c692-949b-11ed-a1eb-0242ac120002"],
    async () => await httpGetTxParams$CreatorWithdrawFund({ projectId })
  );

  if (error) {
    return { error: "fetch-failed", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  const { protocolParamsUtxo } = data.txParams;

  if (!protocolParamsUtxo.datum) {
    return {
      error: "utxo-invalid",
      _debug: {
        message: "invalid protocol params utxo: missing inline datum",
        protocolParamsUtxo,
      },
    };
  }

  const protocolParams: S.Static<typeof ProtocolParamsDatum> = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  return {
    error: null,
    data: { txParams: data.txParams },
    computed: { protocolParams },
  };
}
