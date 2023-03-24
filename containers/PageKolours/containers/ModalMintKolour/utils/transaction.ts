import { getPaymentKeyHash } from "@kreate/protocol/helpers/lucid";
import {
  buildMintKolourNftTx,
  MintKolourNftTxParams,
} from "@kreate/protocol/transactions/kolours/kolour-nft";
import { Lucid, Tx, TxComplete } from "lucid-cardano";

import { LovelaceAmount } from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { KOLOURS_KOLOUR_NFT_PUBLIC_KEY_HASH } from "@/modules/env/kolours/client";
import { KolourQuotation } from "@/modules/kolours/types/Kolours";
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

const KOLOUR_NFT_EXPIRATION = 300_000; // 10 blocks

export async function buildTx(params: BuildTxParams): Promise<BuildTxResult> {
  const tx = await buildTxRaw(params);
  // `nativeUplc` is specified as a temporary workaround for an Aiken bug
  const txComplete = await tx.complete({ nativeUplc: false });

  const txFee = BigInt(txComplete.txComplete.body().fee().to_str());

  return { txFee, txComplete };
}

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

  DisplayableError.assert(
    KOLOURS_KOLOUR_NFT_PUBLIC_KEY_HASH != null,
    "missing kolour nft public key hash"
  );

  const mintParams: MintKolourNftTxParams = {
    quotation,
    kolourNftRefScriptUtxo,
    producerPkh: KOLOURS_KOLOUR_NFT_PUBLIC_KEY_HASH,
    txTimeStart: await getReferenceTxTime(),
    txTimeEnd: Date.now() + KOLOUR_NFT_EXPIRATION,
  };

  const tx = buildMintKolourNftTx(lucid, mintParams);

  return tx;
}
