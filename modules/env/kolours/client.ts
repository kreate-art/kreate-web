import { C } from "lucid-cardano";

import { parseHex, parseStringByRegex } from "../utils/parsers";
import { parseEnv$Optional } from "../utils/wrappers";

// TODO: Shouldn't be Optional ;)
export const KOLOURS_KOLOUR_NFT_POLICY_ID = parseEnv$Optional({
  label: "NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_POLICY_ID",
  input: process.env.NEXT_PUBLIC_KOLOURS_KOLOUR_NFT_POLICY_ID,
  parser: parseHex(),
  defaultValue: "00".repeat(28),
});

export const KOLOURS_PRODUCER_PUBLIC_KEY_HASH = parseEnv$Optional({
  label: "NEXT_PUBLIC_KOLOURS_PRODUCER_PUBLIC_KEY_HASH",
  input: process.env.NEXT_PUBLIC_KOLOURS_PRODUCER_PUBLIC_KEY,
  parser: (text) =>
    C.PublicKey.from_bech32(
      parseStringByRegex(/^ed25519_pk[0-9A-Za-z]+$/)(text)
    )
      .hash()
      .to_hex(),
  defaultValue: null,
});
