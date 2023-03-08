import { parseProtocolParams } from "@teiki/protocol/helpers/schema";
import { getTime } from "@teiki/protocol/helpers/time";
import * as S from "@teiki/protocol/schema";
import { BackingDatum } from "@teiki/protocol/schema/teiki/backing";
import { ProjectDatum } from "@teiki/protocol/schema/teiki/project";

import { Sql } from "../db";

import { getBackerBackingUtxosByProjectId } from "./getBackerBackingUtxosByProjectId";
import { getProjectUtxoByProjectId } from "./getProjectUtxoByProjectId";
import { getProtocolParamsUtxo } from "./getProtocolParamsUtxo";

import { assert } from "@/modules/common-utils";
import { TX_TIME_START_PADDING } from "@/modules/protocol/constants";

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

  const { protocolParams } = parseProtocolParams(
    S.fromCbor(protocolParamsUtxo.datum)
  );

  const now = Date.now();
  const timeProvider = () => now;

  const unstakedAt = getTime({ timeProvider }) - TX_TIME_START_PADDING;

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
