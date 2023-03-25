import { IS_NEXT_BUILD, never } from "../server";
import { parseStringByRegex } from "../utils/parsers";
import { parseEnv$Optional } from "../utils/wrappers";

import { createSecretKey } from "@/modules/crypt";

const parsePrivateKey = parseStringByRegex(/^ed25519_sk[0-9A-Za-z]+$/);

export const KOLOURS_KOLOUR_NFT_FEE_ADDRESS = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "KOLOURS_KOLOUR_NFT_FEE_ADDRESS",
      input: process.env.KOLOURS_KOLOUR_NFT_FEE_ADDRESS,
      parser: parseStringByRegex(/^(addr|addr_test)[0-9a-z]+$/),
      defaultValue: null,
    });

export const KOLOURS_KOLOUR_NFT_PRIVATE_KEY = parseEnv$Optional({
  label: "KOLOURS_KOLOUR_NFT_PRIVATE_KEY",
  input: process.env.KOLOURS_KOLOUR_NFT_PRIVATE_KEY,
  parser: parsePrivateKey,
  defaultValue: null,
});

export const KOLOURS_GENESIS_KREATION_FEE_ADDRESS = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "KOLOURS_GENESIS_KREATION_FEE_ADDRESS",
      input: process.env.KOLOURS_GENESIS_KREATION_FEE_ADDRESS,
      parser: parseStringByRegex(/^(addr|addr_test)[0-9a-z]+$/),
      defaultValue: null,
    });

export const KOLOURS_GENESIS_KREATION_PRIVATE_KEY = parseEnv$Optional({
  label: "KOLOURS_GENESIS_KREATION_PRIVATE_KEY",
  input: process.env.KOLOURS_GENESIS_KREATION_PRIVATE_KEY,
  parser: parsePrivateKey,
  defaultValue: null,
});

export const KOLOURS_HMAC_SECRET = IS_NEXT_BUILD
  ? never()
  : parseEnv$Optional({
      label: "KOLOURS_HMAC_SECRET",
      input: process.env.KOLOURS_HMAC_SECRET,
      parser: (text) =>
        createSecretKey("hmac", parseStringByRegex(/^[ -~]+$/)(text)),
      defaultValue: null,
    });
