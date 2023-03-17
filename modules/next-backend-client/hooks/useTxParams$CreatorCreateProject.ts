import * as S from "@kreate/protocol/schema";
import { ProtocolParamsDatum } from "@kreate/protocol/schema/teiki/protocol";
import useSWR from "swr";

import { httpGetTxParams$CreatorCreateProject } from "../api/httpGetTxParams$CreatorCreateProject";

import { TxParams$CreatorCreateProject$Response } from "@/modules/next-backend/logic/getCreatorCreateProject";

type Result =
  | {
      error: null;
      data: TxParams$CreatorCreateProject$Response;
      computed: { protocolParams: S.Static<typeof ProtocolParamsDatum> };
    }
  | { error: "fetch-failed"; _debug?: unknown }
  | { error: "utxo-invalid"; _debug?: unknown };

export type UseTxParams$CreatorCreateProject$Result = Result;

/**
 * Fetches tx params for flow creator-create-project and extracts useful data.
 * Returns the raw response plus the computed data.
 */
export function useTxParams$CreatorCreateProject(): Result | undefined {
  const { data, error } = useSWR(
    ["60577d67-c6ad-4035-b257-d2b5d7c92350"],
    async () => await httpGetTxParams$CreatorCreateProject()
  );

  if (error) {
    return { error: "fetch-failed", _debug: error };
  }

  if (!data) return undefined;

  const { protocolParamsUtxo } = data;

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

  return { error: null, data, computed: { protocolParams } };
}
