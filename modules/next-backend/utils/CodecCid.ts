import { NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN } from "../../../config/client";

import { WithBufsAs } from "@/modules/with-bufs-as";
import { Codec, CodecError, Url } from "@/modules/with-bufs-as-converters";

export type Cid = string;

/**
 * `CodecCid` is a decoding-only codec, which allows to convert
 * `WithBufsAs<T, Cid>` to `T`.
 */
export const CodecCid: Codec<Cid> = {
  fromUrl: (_value: Url) => {
    throw new CodecError("only decoding is allowed");
  },
  toUrl: ({ data, bufs }: WithBufsAs<Url, Cid>) => {
    const matched = /^sha256:([0-9A-Fa-f]+)$/.exec(data);
    if (!matched) return data;
    const sha256 = matched[1];
    const cid: Cid = bufs[sha256];
    CodecError.assert(cid, `Cannot resolve key: ${sha256}`);
    const url: Url = `${NEXT_PUBLIC_IPFS_GATEWAY_ORIGIN}/ipfs/${cid}`;
    return url;
  },
};
