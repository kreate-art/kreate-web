import * as S from "@teiki/protocol/schema";
import { ProtocolParamsDatum } from "@teiki/protocol/schema/teiki/protocol";
import {
  WithdrawFundsParams,
  withdrawFundsTx,
} from "@teiki/protocol/transactions/project/withdraw-funds";
import { Lucid, RewardAddress, TxComplete } from "lucid-cardano";

import { LovelaceAmount } from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { TxParams$CreatorWithdrawFund } from "@/modules/next-backend/logic/getCreatorWithdrawFund";

export type BuildTxParams = {
  lucid: Lucid;
  txParams: TxParams$CreatorWithdrawFund;
};

export type BuildTxResult = { txFee: LovelaceAmount; txComplete: TxComplete };

/**
 * Builds transaction and returns a `TxComplete` plus other useful info.
 * After this step, field `txComplete` can be used to sign and submit by:
 *
 * ```
 * const txHash = await signAndSubmit(txComplete); // from "@teiki/protocol/helpers/lucid";
 * await lucid.awaitTx(txHash);
 * ```
 */
export async function buildTx({
  lucid,
  txParams,
}: BuildTxParams): Promise<BuildTxResult> {
  const {
    protocolParamsUtxo,
    projectUtxo,
    projectDetailUtxo,
    dedicatedTreasuryUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    projectScriptInfoList,
    dedicatedTreasuryVRefScriptUtxo,
    rewardAddressAndAmount,
  } = txParams;

  assert(
    protocolParamsUtxo.datum,
    "Invalid protocol params utxo: missing datum"
  );

  const protocolParamsDatum = S.fromData(
    S.fromCbor(protocolParamsUtxo.datum),
    ProtocolParamsDatum
  );

  const sharedTreasuryVCredential = lucid.utils.scriptHashToCredential(
    protocolParamsDatum.registry.sharedTreasuryValidator.latest.script.hash
  );
  const protocolSvCredentail = lucid.utils.scriptHashToCredential(
    protocolParamsDatum.registry.protocolStakingValidator.script.hash
  );
  const sharedTreasuryAddress = lucid.utils.credentialToAddress(
    sharedTreasuryVCredential,
    protocolSvCredentail
  );

  const _rewardAddressAndAmount = rewardAddressAndAmount.map(
    ([rewardAddress, rewardAmount]) =>
      [rewardAddress, BigInt(rewardAmount)] as [RewardAddress, bigint]
  );

  const params: WithdrawFundsParams = {
    protocolParamsUtxo,
    projectUtxo,
    projectDetailUtxo,
    dedicatedTreasuryUtxo,
    projectVRefScriptUtxo,
    projectDetailVRefScriptUtxo,
    projectScriptUtxos: projectScriptInfoList.map(
      (info) => info.projectScriptUtxo
    ),
    rewardAddressAndAmount: _rewardAddressAndAmount,
    dedicatedTreasuryVRefScriptUtxo,
    sharedTreasuryAddress,
    actor: "project-owner",
  };
  const tx = withdrawFundsTx(lucid, params);
  // `nativeUplc` is specified as a temporary workaround for an Aiken bug
  const txComplete = await tx.complete({ nativeUplc: false });

  const txFee = BigInt(txComplete.txComplete.body().fee().to_str());

  return { txFee, txComplete };
}
