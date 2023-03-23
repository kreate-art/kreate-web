import { getPaymentKeyHash } from "@kreate/protocol/helpers/lucid";
import {
  MintKolourNftTxParams,
  buildMintKolourNftTx,
} from "@kreate/protocol/transactions/kolours/kolour-nft";
import { Lucid, Tx, TxComplete } from "lucid-cardano";

import { LovelaceAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { KolourQuotation } from "@/modules/kolours/kolour";
import { TxParams$UserMintKolourNft } from "@/modules/next-backend-client/api/httpGetTxParams$UserMintKolourNft";
import { getReferenceTxTime } from "@/modules/protocol/utils";

export type BuildTxParams = {
  lucid: Lucid;
  quotation: KolourQuotation;
  txParams: TxParams$UserMintKolourNft;
};

export type BuildTxResult = {
  txFee: LovelaceAmount;
  txComplete: TxComplete;
};

export async function buildTx(params: BuildTxParams): Promise<BuildTxResult> {
  const tx = await buildTxRaw(params);
  // `nativeUplc` is specified as a temporary workaround for an Aiken bug
  const txComplete = await tx.complete({ nativeUplc: false });

  const txFee = BigInt(txComplete.txComplete.body().fee().to_str());

  return { txFee, txComplete };
}

// TODO: @sk-saru remove this function when the migration is done.
export async function buildTxRaw({
  lucid,
  quotation,
  txParams,
}: BuildTxParams): Promise<Tx> {
  const { kolourNftRefScriptUtxo } = txParams;

  DisplayableError.assert(
    kolourNftRefScriptUtxo.scriptRef != null,
    "invalid kolour nft reference script utxo: must reference kolour nft minting policy"
  );

  const txTime = await getReferenceTxTime();

  const mintParams: MintKolourNftTxParams = {
    quotation,
    kolourNftRefScriptUtxo,
    producerPkh: getPaymentKeyHash(await lucid.wallet.address()),
    txTimeStart: txTime,
    txTimeEnd: txTime + 300_000,
  };

  const tx = buildMintKolourNftTx(lucid, mintParams);

  return tx;
}
