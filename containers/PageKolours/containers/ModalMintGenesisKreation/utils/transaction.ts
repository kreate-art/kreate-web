import {
  buildMintGKNftTx,
  MintGKNftTxParams,
} from "@kreate/protocol/transactions/kolours/genesis-kreaction-nft";
import { Lucid } from "lucid-cardano";

import { DisplayableError } from "@/modules/displayable-error";
import { KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH } from "@/modules/env/kolours/client";
import { GenesisKreationQuotation } from "@/modules/kolours/types/Kolours";
import { getReferenceTxTime } from "@/modules/protocol/utils";

type BuildTxParams = {
  lucid: Lucid;
  name: string;
  description: string;
  quotation: GenesisKreationQuotation;
  txParams: unknown;
};

const GENESIS_KREATION_NFT_EXPIRATION = 300_000; // 10 blocks

export async function buildTxRaw({
  lucid,
  name,
  description,
  quotation,
  txParams,
}: BuildTxParams) {
  const { gkNftRefScriptUtxo } = txParams;

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
