import { httpPostEncrypt } from "../api/httpPostEncrypt";
import { httpPostEncryptAndPin } from "../api/httpPostEncryptAndPin";
import { httpPostIpfsAdd } from "../api/httpPostIpfsAdd";

import { ipfsAdd$WithBufsAs$Blob } from "./ipfsAdd$WithBufsAs$Blob";

import {
  ExclusiveProjectPost,
  PublicProjectPost,
} from "@/modules/business-types";
import { Base64, CipherMeta } from "@/modules/crypt/types";
import { toJsonStable } from "@/modules/json-utils";
import {
  mapBufsAsync,
  mapValuesAsync,
  WithBufsAs,
} from "@/modules/with-bufs-as";

type Cid = string;

async function blobToCipherMetaCid(
  blob: Blob
): Promise<CipherMeta & { cid: Cid }> {
  const cipherMetaCid: CipherMeta & { cid: Cid } = await httpPostEncryptAndPin(
    blob
  );
  return cipherMetaCid;
}

async function blobToCipherMetaBase64(
  blob: string
): Promise<CipherMeta & { ciphertext: Base64 }> {
  const cipherMetaData = await httpPostEncrypt(blob);
  return cipherMetaData;
}

async function blobToCid(blob: Blob): Promise<Cid> {
  const { cid } = await httpPostIpfsAdd(blob);
  return cid;
}

export async function ipfsAdd$ProjectPost(
  blobWBA: WithBufsAs<PublicProjectPost, Blob>,
  tierToView: number | null
): Promise<Cid> {
  if (!tierToView) {
    return ipfsAdd$WithBufsAs$Blob(blobWBA);
  } else {
    const cidWBA = await mapBufsAsync(
      blobWBA,
      async (bufs) =>
        await mapValuesAsync(
          bufs,
          async (buf) => await blobToCipherMetaCid(buf)
        )
    );
    // Refine this...
    const newBody = await blobToCipherMetaBase64(
      toJsonStable(cidWBA.data.body)
    );
    const mediaCount = Object.keys(cidWBA.bufs).length;

    const cidWBAEncryptedBody: WithBufsAs<
      ExclusiveProjectPost,
      CipherMeta & { cid: Cid }
    > = {
      bufs: cidWBA.bufs,
      data: {
        body: newBody,
        title: cidWBA.data.title,
        summary: cidWBA.data.summary,
        exclusive: {
          tier: tierToView,
        },
        mediaCount,
      },
    };

    return blobToCid(new Blob([toJsonStable(cidWBAEncryptedBody)]));
  }
}
