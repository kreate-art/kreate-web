import { getTime } from "@teiki/protocol/helpers/time";
import * as S from "@teiki/protocol/schema";
import { BackingDatum } from "@teiki/protocol/schema/teiki/backing";
import { ProjectDatum } from "@teiki/protocol/schema/teiki/project";
import { ProtocolParamsDatum } from "@teiki/protocol/schema/teiki/protocol";

import { Sql } from "../db";

import { getBackerBackingUtxosByProjectId } from "./getBackerBackingUtxosByProjectId";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";
import { getTxTimeStartPadding } from "@/modules/protocol/utils";

export type TotalProjectTeikiRewardsByBacker$Response = {
  amount: bigint;
};

type Params = {
  backerAddress: string;
  projectId: string;
};

// TODO: Claim teiki rewards by flowers and n backing UTxOs
export async function getProjectTeikiRewardsByBacker(
  sql: Sql,
  { backerAddress, projectId }: Params
): Promise<TotalProjectTeikiRewardsByBacker$Response> {
  const [backingUtxos, protocolParamsUtxo, projectUtxo] = await Promise.all([
    getBackerBackingUtxosByProjectId(sql, {
      backerAddress,
      projectId,
    }),
    getProtocolParamsUtxo(sql),
    getProjectUtxoByProjectId(sql, { projectId }),
  ]);
  assert(
    protocolParamsUtxo?.datum != null,
    "invalid protocol params utxo: missing inline datum"
  );

  assert(
    projectUtxo?.datum != null,
    "invalid project utxo: missing inline datum"
  );

  const projectDatum = S.fromData(S.fromCbor(projectUtxo.datum), ProjectDatum);

  const protocolParams = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const now = Date.now();
  const timeProvider = () => now;

  const txTimeStartPadding = await getTxTimeStartPadding();

  const unstakedAt = getTime({ timeProvider }) - txTimeStartPadding;

  let totalTeikiRewards = BigInt(0);

  for (const backingUtxo of backingUtxos) {
    assert(
      backingUtxo.datum != null,
      "Invalid backing UTxO: Missing inline datum"
    );

    const backingDatum = S.fromData(
      S.fromCbor(backingUtxo.datum),
      BackingDatum
    );

    const timePassed = BigInt(unstakedAt) - backingDatum.backedAt.timestamp;

    if (timePassed >= protocolParams.epochLength.milliseconds) {
      const backingAmount = BigInt(backingUtxo.assets.lovelace);

      const isMatured =
        backingDatum.milestoneBacked < projectDatum.milestoneReached &&
        projectDatum.status.type !== "PreDelisted";

      const teikiRewards = isMatured
        ? (backingAmount *
            BigInt(BigInt(unstakedAt) - backingDatum.backedAt.timestamp)) /
          BigInt(protocolParams.epochLength.milliseconds) /
          protocolParams.teikiCoefficient
        : BigInt(0);

      totalTeikiRewards += teikiRewards;
    }
  }
  return {
    amount: totalTeikiRewards,
  };
}
