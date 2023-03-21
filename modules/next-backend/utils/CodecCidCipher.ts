import * as crypt from "@/modules/crypt/";
import { HOST } from "@/modules/env/client";
import { KREATE_CONTENT_HMAC_SECRET } from "@/modules/env/server";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Codec, CodecError, Url } from "@/modules/with-bufs-as-converters";

export type Cid = string;

type CipherMeta$Cid = crypt.CipherMeta & { cid: Cid };
/**
 * `CodecCid` is a decoding-only codec, which allows to convert
 * `WithBufsAs<T, Cid>` to `T`.
 */
export const CodecCidCipher: Codec<CipherMeta$Cid> = {
  fromUrl: (_value: Url) => {
    throw new CodecError("only decoding is allowed");
  },
  toUrl: ({ data, bufs }: WithBufsAs<Url, CipherMeta$Cid>) => {
    const matched = /^sha256:([0-9A-Fa-f]+)$/.exec(data);
    if (!matched) return data;
    const sha256 = matched[1];

    const cmc: CipherMeta$Cid = bufs[sha256];
    CodecError.assert(cmc, `Cannot resolve key: ${sha256}`);

    const { cid, ...meta } = cmc;

    // Rename this..or not?
    const metaverse: Omit<crypt.CipherMeta, "enc"> = {
      iv: meta.iv,
      kid: meta.kid,
      tag: meta.tag,
    };

    //TODO: Might need to refine this
    if (meta.aad) metaverse.aad = meta.aad;

    const url: Url =
      HOST +
      "/api/v1/exclusive/decrypt/ipfs/" +
      cid +
      "?" +
      new URLSearchParams({
        ...metaverse,
        ...signIpfsUrl(cid, metaverse),
      });

    return url;
  },
};

// TODO: Export to a new module
function signIpfsUrl(
  cid: Cid,
  meta: Omit<crypt.CipherMeta, "enc">,
  ttl = 600
): { exp: string; sig: crypt.Base64 } {
  const exp = Math.round(Date.now() / 1000) + ttl;
  const sig = crypt.hmacSign(KREATE_CONTENT_HMAC_SECRET, {
    json: { ...meta, cid, exp },
  });
  return { exp: exp.toString(), sig };
}
