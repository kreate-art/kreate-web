import { Address } from "lucid-cardano";

import { ExtraParams } from "./common";

import { Lovelace } from "@/modules/next-backend/types";

export type GenesisKreationId = string; // Act as token name also

export type GenesisKreationQuotation = {
  id: GenesisKreationId;
  metadata: {
    name: string;
    description: string;
    image: string; // ipfs://<cid>
  };
  fee: Lovelace;
  listedFee: Lovelace;
  userAddress: Address;
  feeAddress: Address;
  expiration: number; // Unix Timestamp in seconds
} & ExtraParams;

export function calculateGenesisKreationFee(_id: GenesisKreationId): Lovelace {
  // TODO: Finalize price formula ;)
  return BigInt(1_000_000_000);
}
