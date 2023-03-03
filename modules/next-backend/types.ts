// This module is copied from @teiki-index/blob/main/src/types/chain.ts
import * as O from "@cardano-ogmios/schema";
import { Hex } from "@teiki/protocol/types";
import * as L from "lucid-cardano";

export type Lovelace = bigint;

export type WithId<T, I = bigint> = T & { id: I };

// chain.block
export type ChainBlock = {
  slot: O.Slot;
  hash: O.DigestBlake2BBlockBody; // Hex
  height: O.BlockNo;
  time: Date;
};

// chain.output
export type ChainOutput = {
  tag: string | null;
  txId: L.TxHash;
  txIx: number;
  address: L.Address;
  value: L.Assets;
  datum: L.Datum | null;
  datumHash: L.DatumHash | null;
  scriptHash: L.ScriptHash | null;
  createdSlot: O.Slot;
  spentSlot: O.Slot | null;
};

// chain.script
export type ChainScript = {
  scriptHash: L.ScriptHash;
  scriptType: L.ScriptType;
  script: Hex;
};

type WithScript = Omit<ChainScript, "scriptHash">;
export type ChainOutputWithScript = ChainOutput &
  (WithScript | { [_ in keyof WithScript]?: null });

export type EnrichedUtxo = L.UTxO & { scriptHash: L.ScriptHash | null };

export function toLucidUtxo(output: ChainOutputWithScript): EnrichedUtxo {
  return {
    txHash: output.txId,
    outputIndex: output.txIx,
    address: output.address,
    assets: output.value,
    datum: output.datum,
    datumHash: output.datumHash,
    scriptHash: output.scriptHash,
    scriptRef: output.scriptType
      ? { type: output.scriptType, script: output.script }
      : null,
  };
}

// chain.backing
export type ChainBacking = {
  projectId: Hex;
  backerAddress: L.Address;
  backingAmount: Lovelace;
  milestoneBacked: number;
  backedAt: Date;
};

export type ChainBackingAction = {
  action: (typeof ActionTypes)[number];
  projectId: Hex;
  actorAddress: L.Address;
  amount: Lovelace;
  time: Date;
  message: string | null;
  slot: number;
  txId: L.TxHash;
};

// @sk-yagi: We will add other tags when supported
export const ActionTypes = [
  "back",
  "unback",
  // "claim_rewards",
  // "migrate",
] as const;

// TODO: @sk-tenba: Add "political", "drug", "discrimination" when quality is decent.
export const MODERATION_TAGS = [
  // "toxicity", @sk-yagi: Add this when quality is decent
  "obscene",
  "identityAttack",
  // "insult", @sk-yagi: Add this when quality is decent
  "threat",
  "sexualExplicit",
  "gun",
] as const;
export type ModerationTags = (typeof MODERATION_TAGS)[number];
