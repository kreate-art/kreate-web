import {
  parseBaseUrl,
  parseBoolean,
  parseEnum,
  parseHex,
  parseSlug,
} from "./utils/parsers";
import { parseEnv, parseEnv$Optional } from "./utils/wrappers";

export const KREATE_ENV = parseEnv({
  label: "NEXT_PUBLIC_KREATE_ENV",
  input: process.env.NEXT_PUBLIC_KREATE_ENV,
  parser: parseEnum(["mainnet", "testnet"]),
});

export const HOST = parseEnv({
  label: "NEXT_PUBLIC_HOST",
  input: process.env.NEXT_PUBLIC_HOST,
  parser: parseBaseUrl(),
});

export const BLOCKFROST_URL = parseEnv({
  label: "NEXT_PUBLIC_BLOCKFROST_URL",
  input: process.env.NEXT_PUBLIC_BLOCKFROST_URL,
  parser: parseBaseUrl(),
});

export const BLOCKFROST_PROJECT_ID = parseEnv({
  label: "NEXT_PUBLIC_BLOCKFROST_PROJECT_ID",
  input: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  parser: parseSlug(),
});

export const NETWORK = parseEnv({
  label: "NEXT_PUBLIC_NETWORK",
  input: process.env.NEXT_PUBLIC_NETWORK,
  parser: parseEnum(["Mainnet", "Testnet", "Preview", "Preprod"]),
});

export const SHOW_SECRET_ROUTES = parseEnv({
  label: "NEXT_PUBLIC_SHOW_SECRET_ROUTES",
  input: process.env.NEXT_PUBLIC_SHOW_SECRET_ROUTES,
  parser: parseBoolean(),
});

export const ENABLE_LEGACY = parseEnv({
  label: "NEXT_PUBLIC_ENABLE_LEGACY",
  input: process.env.NEXT_PUBLIC_ENABLE_LEGACY,
  parser: parseBoolean(),
});

export const PROJECT_AT_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROJECT_AT_MPH",
  input: process.env.NEXT_PUBLIC_PROJECT_AT_MPH,
  parser: parseHex(),
});

export const PROOF_OF_BACKING_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROOF_OF_BACKING_MPH",
  input: process.env.NEXT_PUBLIC_PROOF_OF_BACKING_MPH,
  parser: parseHex(),
});

export const LEGACY_PROOF_OF_BACKING_MPH = parseEnv$Optional({
  label: "NEXT_PUBLIC_LEGACY_PROOF_OF_BACKING_MPH",
  input: process.env.NEXT_PUBLIC_LEGACY_PROOF_OF_BACKING_MPH,
  parser: parseHex(),
  defaultValue: null,
});

export const PROTOCOL_NFT_MPH = parseEnv({
  label: "NEXT_PUBLIC_PROTOCOL_NFT_MPH",
  input: process.env.NEXT_PUBLIC_PROTOCOL_NFT_MPH,
  parser: parseHex(),
});

export const TEIKI_MPH = parseEnv({
  label: "NEXT_PUBLIC_TEIKI_MPH",
  input: process.env.NEXT_PUBLIC_TEIKI_MPH,
  parser: parseHex(),
});

export const TEIKI_ASSET_NAME = parseEnv({
  label: "NEXT_PUBLIC_TEIKI_ASSET_NAME",
  input: process.env.NEXT_PUBLIC_TEIKI_ASSET_NAME,
  parser: parseHex(),
});

export const AI_URL = parseEnv({
  label: "NEXT_PUBLIC_AI_URL",
  input: process.env.NEXT_PUBLIC_AI_URL,
  parser: parseBaseUrl(),
});

export const GRAMMARLY_CLIENT_ID = parseEnv({
  label: "NEXT_PUBLIC_GRAMMARLY_CLIENT_ID",
  input: process.env.NEXT_PUBLIC_GRAMMARLY_CLIENT_ID,
  parser: parseSlug(),
});

export const KREATE_CDN = parseEnv({
  label: "NEXT_PUBLIC_KREATE_CDN",
  input: process.env.NEXT_PUBLIC_KREATE_CDN,
  parser: parseBaseUrl(),
});

export const IPFS_GATEWAY_ORIGIN = parseEnv({
  label: "NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN",
  input: process.env.NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN,
  parser: parseBaseUrl(),
});

export const ALTERNATE_IPFS_GATEWAY_ORIGINS = parseEnv$Optional({
  label: "NEXT_PUBLIC_ALTERNATE_IPFS_GATEWAY_ORIGINS",
  input: process.env.NEXT_PUBLIC_ALTERNATE_IPFS_GATEWAY_ORIGINS,
  parser: (text) => {
    const purl = parseBaseUrl();
    const pchild = (e: string) => purl(e.trim());
    return text.split(",").map(pchild);
  },
  defaultValue: [],
});
