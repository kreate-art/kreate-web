import { LovelaceAmount } from "@kreate/protocol/schema/teiki/kolours";
import {
  buildMintGKNftTx,
  MintGKNftTxParams,
} from "@kreate/protocol/transactions/kolours/genesis-kreaction-nft";
import { Lucid, TxComplete } from "lucid-cardano";

import { DisplayableError } from "@/modules/displayable-error";
import { KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH } from "@/modules/env/kolours/client";
import { GenesisKreationQuotation } from "@/modules/kolours/types/Kolours";
import { TxParams$UserMintGKNft } from "@/modules/next-backend-client/api/httpGetTxParams$UserMintGKNft";
import { getReferenceTxTime } from "@/modules/protocol/utils";

export type BuildTxParams = {
  lucid: Lucid;
  name: string;
  description: string;
  quotation: GenesisKreationQuotation;
  txParams: TxParams$UserMintGKNft;
};

const GENESIS_KREATION_NFT_EXPIRATION = 300_000; // 10 blocks

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

export async function buildTxRaw({
  lucid,
  name,
  description,
  quotation,
  txParams,
}: BuildTxParams) {
  const { gkNftRefScriptUtxo } = txParams;

  DisplayableError.assert(
    gkNftRefScriptUtxo.scriptRef != null,
    "invalid kolour nft reference script utxo: must reference kolour nft minting policy"
  );

  DisplayableError.assert(
    KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH != null,
    "missing kolour nft public key hash"
  );

  const mintParams: MintGKNftTxParams = {
    quotation: {
      ...quotation,
      fee: BigInt(quotation.fee),
      listedFee: BigInt(quotation.listedFee),
    },
    gkNftRefScriptUtxo,
    producerPkh: KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH,
    name,
    description,
    txTimeStart: await getReferenceTxTime(),
    txTimeEnd: Date.now() + GENESIS_KREATION_NFT_EXPIRATION,
  };
  const tx = buildMintGKNftTx(lucid, mintParams);

  return tx;
}
