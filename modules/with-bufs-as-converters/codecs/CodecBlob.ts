import { CodecError } from "../errors";
import { Url, Codec } from "../types";
import { arrayBufferToSha256 } from "../utils/buffer";

import { pure, WithBufsAs } from "@/modules/with-bufs-as";

// NOTE: This file defines `CodecBlob`, which is similar to
// `CodecArrayBuffer`, except that each buf is a `Blob`.
// We will use this codec to replace `CodecArrayBuffer`.

async function fromUrl(url: Url): Promise<WithBufsAs<Url, Blob>> {
  if (!url.startsWith("blob:")) return pure(url);
  const response = await fetch(url);
  const blob = await response.blob();
  const buf = await blob.arrayBuffer();
  // TODO: @sk-kitsune: There is a more efficient way to do this
  // The current implementation loads everything into RAM.
  // Let's resolve later.
  const sha256 = await arrayBufferToSha256(buf);
  return { data: "sha256:" + sha256, bufs: { [sha256]: blob } };
}

function toUrl({ data, bufs }: WithBufsAs<Url, Blob>): Url {
  const matched = /^sha256:([0-9a-fA-F]+)$/.exec(data);
  if (!matched) return data;
  const sha256 = matched[1];
  const blob = bufs[sha256];
  CodecError.assert(blob, `Cannot resolve key: ${sha256}`);
  const url = URL.createObjectURL(blob);
  return url;
}

const CodecBlob: Codec<Blob> = { fromUrl, toUrl };

export default CodecBlob;
