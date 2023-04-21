import * as S from "@kreate/protocol/schema";
import { ProjectDatum } from "@kreate/protocol/schema/teiki/project";
import {
  PlantParams,
  plantTx,
} from "@kreate/protocol/transactions/backing/plant";
import { Address, Lucid, Tx, TxComplete } from "lucid-cardano";

import { splitToLines } from "@/modules/array-utils";
import { try$ } from "@/modules/async-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { TxParams$BackerUnbackProject } from "@/modules/next-backend/logic/getBackerUnbackProject";
import { ProjectStatus } from "@/modules/next-backend-client/api/httpGetTxParams$BackerUnbackProject";
import { getReferenceTxTime } from "@/modules/protocol/utils";

export type BuildTxParams = {
  lucid: Lucid;
  backerAddress: string;
  unbackLovelaceAmount: LovelaceAmount;
  message: string;
  projectStatus?: ProjectStatus;
  txParams: TxParams$BackerUnbackProject;
  action: "unback" | "claim reward" | "migrate";
};

export type BuildTxResult = {
  txFee: LovelaceAmount;
  txComplete: TxComplete;
};

type ResultT<T> = { ok: true; result: T } | { ok: false; error?: unknown };

export async function buildTx(params: BuildTxParams): Promise<BuildTxResult> {
  const tx = await buildTxRaw(params);
  const txComplete = await tx.complete({ nativeUplc: false });
  const txFee = BigInt(txComplete.txComplete.body().fee().to_str());

  return { txFee, txComplete };
}

export async function buildTxRaw({
  lucid,
  backerAddress,
  unbackLovelaceAmount,
  message,
  projectStatus,
  txParams,
  action,
}: BuildTxParams): Promise<Tx> {
  const {
    protocolParamsUtxo,
    projectUtxo,
    projectScriptUtxo,
    proofOfBackingMpRefUtxo,
    backingScriptRefUtxo,
    backingUtxos,
  } = txParams;

  DisplayableError.assert(projectUtxo.datum != null, {
    title: "Invalid project UTXO",
    description: "Missing inline datum",
  });

  DisplayableError.assert(
    proofOfBackingMpRefUtxo.scriptRef != null &&
      proofOfBackingMpRefUtxo.scriptHash != null,
    {
      title: "Invalid proof of backing reference UTXO",
      description: "Must reference proof of backing script",
    }
  );

  DisplayableError.assert(
    backingScriptRefUtxo.scriptRef != null &&
      backingScriptRefUtxo.scriptHash != null,
    {
      title: "Invalid backing reference UTXO",
      description: "Must reference backing script",
    }
  );

  let backingScriptAddress: Address | undefined = undefined;
  // if (projectStatus !== "closed" && projectStatus !== "delisted") {
  // Hotfix for deprecated code
  if (projectScriptUtxo) {
    // NOTE: get project credential from project script address due to AllocateStaking...
    DisplayableError.assert(projectScriptUtxo != null, {
      title: "Invalid transaction parameters",
      description: "Missing project script UTxO",
    });

    const projectStakeCredential = lucid.utils.getAddressDetails(
      projectScriptUtxo.address
    ).stakeCredential;

    const backingValidatorHash = backingScriptRefUtxo.scriptHash;

    backingScriptAddress = lucid.utils.credentialToAddress(
      lucid.utils.scriptHashToCredential(backingValidatorHash),
      projectStakeCredential
    );
  }

  const projectDatum = S.fromData(S.fromCbor(projectUtxo.datum), ProjectDatum);

  const txTime = await getReferenceTxTime();

  const plantParams: PlantParams = {
    protocolParamsUtxo,
    projectInfo: {
      id: projectDatum.projectId.id,
      currentMilestone: projectDatum.milestoneReached,
      projectUtxo,
      projectScriptUtxo,
    },
    backingInfo: {
      amount: BigInt(0) - BigInt(unbackLovelaceAmount), // minus for unbacking
      backerAddress,
      backingUtxos,
      backingScriptAddress,
      backingScriptRefUtxo,
      proofOfBackingMpRefUtxo,
      proofOfBackingMph: proofOfBackingMpRefUtxo.scriptHash,
    },
    // teikiMintingInfo: txParams.teikiMintingInfo,
    // Hotfix for deprecated token
    teikiMintingInfo: undefined,
    txTime,
  };

  const tx = await try$(
    () => {
      const tx = plantTx(lucid, plantParams) //
        .addSigner(plantParams.backingInfo.backerAddress);

      return message.length
        ? tx.attachMetadata(674, { msg: splitToLines(message, 64) })
        : tx;
    },
    (error) => {
      switch (error instanceof Error ? error.message : undefined) {
        case "Invalid unstake time":
          throw new DisplayableError({
            title: `Cannot ${action} too early!`,
            description:
              "You must wait at least 10 minutes from the previous backing, unbacking or reward claiming.",
            cause: error,
          });
        default:
          throw DisplayableError.from(error, "Unknown error");
      }
    }
  );

  return tx;
}

export async function tryBuildTx(
  params: BuildTxParams
): Promise<ResultT<BuildTxResult>> {
  try {
    const result = await buildTx(params);
    return { ok: true, result };
  } catch (error) {
    return { ok: false, error };
  }
}
