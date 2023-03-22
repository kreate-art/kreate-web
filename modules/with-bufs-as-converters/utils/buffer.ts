type Sha256 = string;

const SUBTLE_CRYPTO_SIZE_LIMIT = 64 << 20;

export function hexToByte(text: string): number {
  return parseInt(text, 16);
}

export function byteToHex(byte: number): string {
  return byte.toString(16).padStart(2, "0");
}

export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), byteToHex).join("");
}

export function hexToArrayBuffer(text: string): ArrayBuffer {
  const matches = text.match(/[0-9a-fA-F]{2}/gi);
  if (!matches) return new ArrayBuffer(0);
  const typedArray = new Uint8Array(matches.map(hexToByte));
  return typedArray.buffer;
}

export async function blobToSha256(blob: Blob): Promise<Sha256> {
  /**NOTE: @sk-tenba: for better performance, if the size is less than 64MB, the hash
   * the SHA-256 should be calculated from the array buffer.
   */
  if (
    blob.size < SUBTLE_CRYPTO_SIZE_LIMIT &&
    globalThis?.crypto?.subtle != null
  ) {
    const buf = await blob.arrayBuffer();
    const bytesOfSha256 = await globalThis?.crypto?.subtle.digest(
      "SHA-256",
      buf
    );
    const sha256 = await arrayBufferToHex(bytesOfSha256);
    return sha256;
  }
  const crypto = await import("crypto");
  const reader = blob.stream().getReader();
  const sha256stream = crypto.createHash("sha256");
  while (true) {
    const chunk = await reader.read();
    if (!chunk.value) break;
    sha256stream.update(chunk.value);
  }
  return sha256stream.digest("hex");
}
