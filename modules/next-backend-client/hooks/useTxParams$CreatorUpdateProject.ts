import * as S from "@teiki/protocol/schema";
import { ProjectDetailDatum } from "@teiki/protocol/schema/teiki/project";
import { ProtocolParamsDatum } from "@teiki/protocol/schema/teiki/protocol";
import useSWR from "swr";

import { httpGetTxParams$CreatorUpdateProject } from "../api/httpGetTxParams$CreatorUpdateProject";

import { TxParams$CreatorUpdateProject } from "@/modules/next-backend/logic/getCreatorUpdateProject";

type Params = {
  projectId: string;
};

type Result =
  | {
      error: null;
      data: { txParams: TxParams$CreatorUpdateProject };
      computed: {
        protocolParams: S.Static<typeof ProtocolParamsDatum>;
        projectDetail: S.Static<typeof ProjectDetailDatum>;
      };
    }
  | { error: "fetch-failed"; _debug?: unknown }
  | { error: "response-error"; _debug?: unknown }
  | { error: "utxo-invalid"; _debug?: unknown };

export type UseTxParams$CreatorUpdateProject$Result = Result;

export function useTxParams$CreatorUpdateProject({
  projectId,
}: Params): Result | undefined {
  const { data, error } = useSWR(
    ["b7858934-4ad6-4a59-b455-d479004a2b40"],
    async () => await httpGetTxParams$CreatorUpdateProject({ projectId })
  );

  if (error) {
    return { error: "fetch-failed", _debug: error };
  }

  if (!data) return undefined;

  if (data.error) {
    return { error: "response-error", _debug: data };
  }

  const { protocolParamsUtxo, projectDetailUtxo } = data.txParams;

  if (!protocolParamsUtxo.datum) {
    return {
      error: "utxo-invalid",
      _debug: {
        message: "invalid protocol params utxo: missing inline datum",
        protocolParamsUtxo,
      },
    };
  }

  if (!projectDetailUtxo.datum) {
    return {
      error: "utxo-invalid",
      _debug: {
        message: "invalid project detail utxo: missing inline datum",
        protocolParamsUtxo,
      },
    };
  }

  const protocolParams: S.Static<typeof ProtocolParamsDatum> = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const projectDetail: S.Static<typeof ProjectDetailDatum> = S.fromData(
    S.fromCbor(projectDetailUtxo.datum),
    ProjectDetailDatum
  );

  return {
    error: null,
    data: { txParams: data.txParams },
    computed: { protocolParams, projectDetail },
  };
}
