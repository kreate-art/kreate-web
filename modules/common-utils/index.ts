import { NEXT_PUBLIC_NETWORK } from "../../config/client";

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message || "assertion failed");
  }
}

export function todo<T>(message: string, ..._ignored: unknown[]): T {
  throw new Error(`TODO: ${message}`);
}

export function getExplorerUrl(txHash: string): string {
  switch (NEXT_PUBLIC_NETWORK) {
    case "Mainnet":
      return `https://cexplorer.io/tx/${txHash}`;
    case "Preprod":
      return `https://preprod.cexplorer.io/tx/${txHash}`;
    case "Preview":
      return `https://preview.cexplorer.io/tx/${txHash}`;
  }
}
