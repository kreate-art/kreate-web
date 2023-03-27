import { C } from "lucid-cardano";

import { parseHex, parseStringByRegex } from "../utils/parsers";
import { parseEnv, parseEnv$Optional } from "../utils/wrappers";

function parsePublicKey(text: string) {
  const publicKey = C.PublicKey.from_bech32(
    parseStringByRegex(/^ed25519_pk[0-9A-Za-z]+$/)(text)
  );
  return publicKey.hash().to_hex();
}

export const KOLOURS_KOLOUR_NFT_POLICY_ID = parseEnv({
  label: "NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_POLICY_ID",
  input: process.env.NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_POLICY_ID,
  parser: parseHex(),
});

export const KOLOURS_KOLOUR_NFT_PUBLIC_KEY_HASH = parseEnv$Optional({
  label: "NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_PUBLIC_KEY_HASH",
  input: process.env.NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_PUBLIC_KEY,
  parser: parsePublicKey,
  defaultValue: null,
});

export const KOLOURS_GENESIS_KREATION_POLICY_ID = parseEnv({
  label: "NEXT_PUBLIC_KOLOURS_GENESIS_KREATION_POLICY_ID",
  input: process.env.NEXT_PUBLIC_KOLOURS_GENESIS_KREATION_POLICY_ID,
  parser: parseHex(),
});

export const KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH = parseEnv$Optional({
  label: "NEXT_PUBLIC_KOLOURS_GENESIS_KREATION_PUBLIC_KEY_HASH",
  input: process.env.NEXT_PUBLIC_KOLOURS_GENESIS_KREATION_PUBLIC_KEY,
  parser: parsePublicKey,
  defaultValue: null,
});
