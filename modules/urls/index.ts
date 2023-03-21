import {
  ALTERNATE_IPFS_GATEWAY_ORIGINS,
  IPFS_GATEWAY_ORIGIN,
  NETWORK,
} from "@/modules/env/client";

export function getExplorerUrl(txHash: string): string {
  switch (NETWORK) {
    case "Mainnet":
      return `https://cexplorer.io/tx/${txHash}`;
    case "Preprod":
      return `https://preprod.cexplorer.io/tx/${txHash}`;
    case "Preview":
      return `https://preview.cexplorer.io/tx/${txHash}`;
    default:
      throw new Error(`Sorry we don't support ${NETWORK}`);
  }
}

const IPFS_ORIGINS = [
  IPFS_GATEWAY_ORIGIN,
  ...ALTERNATE_IPFS_GATEWAY_ORIGINS,
].map((o) => o + "/");

export function patchIpfsUrl(url: string): string | undefined {
  // @sk-shishi: This is the "safest" option I have at the moment without messing up
  // all the usages of `CodecCid`.
  // The patched URL Must match the path in `middleware.ts`.
  if (process.env.NODE_ENV !== "development")
    for (const origin of IPFS_ORIGINS)
      if (url.startsWith(origin)) return "/_ipfs/" + url.slice(origin.length);
  return undefined;
}
