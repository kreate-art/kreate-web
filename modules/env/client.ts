import {
  parseBaseUrl,
  parseBoolean,
  parseEnum,
  parseHex,
  parseSlug,
} from "./utils/parsers";
import { parseEnv, parseEnv$Optional } from "./utils/wrappers";

export const HOST = parseEnv({
  label: "NEXT_PUBLIC_HOST",
  value: process.env.NEXT_PUBLIC_HOST,
  parser: parseBaseUrl(),
});

export const BLOCKFROST_URL = parseEnv({
  label: "NEXT_PUBLIC_BLOCKFROST_URL",
  value: process.env.NEXT_PUBLIC_BLOCKFROST_URL,
  parser: parseBaseUrl(),
});

export const BLOCKFROST_PROJECT_ID = parseEnv({
  label: "NEXT_PUBLIC_BLOCKFROST_PROJECT_ID",
  value: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  parser: parseSlug(),
});

export const NETWORK = parseEnv({
  label: "NEXT_PUBLIC_NETWORK",
  value: process.env.NEXT_PUBLIC_NETWORK,
  parser: parseEnum(["Mainnet", "Testnet", "Preview", "Preprod"]),
});

export const SHOW_SECRET_ROUTES = parseEnv({
  label: "NEXT_PUBLIC_SHOW_SECRET_ROUTES",
  value: process.env.NEXT_PUBLIC_SHOW_SECRET_ROUTES,
  parser: parseBoolean(),
});

export const ENABLE_LEGACY = parseEnv({
  label: "NEXT_PUBLIC_ENABLE_LEGACY",
  value: process.env.NEXT_PUBLIC_ENABLE_LEGACY,
  parser: parseBoolean(),
});

export const PROJECT_AT_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROJECT_AT_MPH",
  value: process.env.NEXT_PUBLIC_PROJECT_AT_MPH,
  parser: parseHex(),
});

export const PROOF_OF_BACKING_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROOF_OF_BACKING_MPH",
  value: process.env.NEXT_PUBLIC_PROOF_OF_BACKING_MPH,
  parser: parseHex(),
});

export const LEGACY_PROOF_OF_BACKING_MPH = parseEnv$Optional({
  label: "NEXT_PUBLIC_LEGACY_PROOF_OF_BACKING_MPH",
  value: process.env.NEXT_PUBLIC_LEGACY_PROOF_OF_BACKING_MPH,
  parser: parseHex(),
  defaultValue: null,
});

export const PROTOCOL_NFT_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROTOCOL_NFT_MPH",
  value: process.env.NEXT_PUBLIC_PROTOCOL_NFT_MPH,
  parser: parseHex(),
});

export const TEIKI_MPH = parseEnv({
  label: "NEXT_PUBLIC_TEIKI_MPH",
  value: process.env.NEXT_PUBLIC_TEIKI_MPH,
  parser: parseHex(),
});

export const TEIKI_ASSET_NAME = parseEnv({
  label: "NEXT_PUBLIC_TEIKI_ASSET_NAME",
  value: process.env.NEXT_PUBLIC_TEIKI_ASSET_NAME,
  parser: parseHex(),
});

export const AI_URL = parseEnv({
  label: "NEXT_PUBLIC_AI_URL",
  value: process.env.NEXT_PUBLIC_AI_URL,
  parser: parseBaseUrl(),
});

export const GRAMMARLY_CLIENT_ID = parseEnv({
  label: "NEXT_PUBLIC_GRAMMARLY_CLIENT_ID",
  value: process.env.NEXT_PUBLIC_GRAMMARLY_CLIENT_ID,
  parser: parseSlug(),
});

export const TEIKI_CDN = parseEnv({
  label: "NEXT_PUBLIC_TEIKI_CDN",
  value: process.env.NEXT_PUBLIC_TEIKI_CDN,
  parser: parseBaseUrl(),
});

export const IPFS_GATEWAY_ORIGIN = parseEnv({
  label: "NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN",
  value: process.env.NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN,
  parser: parseBaseUrl(),
});
