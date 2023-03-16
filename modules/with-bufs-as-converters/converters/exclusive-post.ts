import { JSONContent } from "@tiptap/core";

import { Converters } from "..";

import {
  AnyProjectPost,
  ExclusiveProjectPost,
  PublicProjectPost,
} from "@/modules/business-types";
import * as crypt from "@/modules/crypt";
import { TEIKI_CONTENT_KEYS } from "@/modules/env/server";
import { fromJson } from "@/modules/json-utils";
import { CodecCidCipher } from "@/modules/next-backend/utils/CodecCidCipher";
import { WithBufsAs } from "@/modules/with-bufs-as";

type Cid = string;

export function decryptExclusivePost(
  excPost: WithBufsAs<ExclusiveProjectPost, crypt.CipherMeta & { cid: Cid }>,
  tier: number | null
): AnyProjectPost {
  const bodyCipherMeta$plainText = excPost.data.body;
  const bodyCipherMeta: crypt.CipherMeta = {
    enc: "proto", // TODO: Change this to "proto"
    kid: bodyCipherMeta$plainText.kid,
    iv: bodyCipherMeta$plainText.iv,
    tag: bodyCipherMeta$plainText.tag,
  };
  if (bodyCipherMeta$plainText.aad)
    bodyCipherMeta.aad = bodyCipherMeta$plainText.aad;

  const requiredTier = excPost.data.exclusive.tier;

  // TODO: Hope @shuyshuy won't kill me because of this
  // Me didn't really want to use 3 types
  if (!tier || tier < requiredTier) {
    const { body: _1, ...others } = excPost.data;
    const lockedPost: ExclusiveProjectPost = {
      ...others,
      body: _1,
    };
    return lockedPost;
  }

  const wbDecryptedBody = decryptContent(
    bodyCipherMeta,
    bodyCipherMeta$plainText.ciphertext
  );

  // TODO: Error handling
  const plainBody: JSONContent = fromJson(wbDecryptedBody);

  const { body: _1, exclusive: _2, ...foobar } = excPost.data;

  // These foobar should be gone.
  const fooBarPublicPostData: PublicProjectPost = {
    ...foobar,
    body: plainBody,
  };

  const fooWithBufsAsPublicPost: WithBufsAs<
    PublicProjectPost,
    crypt.CipherMeta & { cid: Cid }
  > = {
    bufs: excPost.bufs,
    data: fooBarPublicPostData,
  };

  const plainPublicPost = Converters.toPublicProjectPost(CodecCidCipher)(
    fooWithBufsAsPublicPost
  );

  return plainPublicPost;
}

function decryptContent(cipherMeta: crypt.CipherMeta, encrypted: crypt.Base64) {
  const { key } = crypt.selectKey(TEIKI_CONTENT_KEYS, cipherMeta.kid);
  const decipher = crypt.createDecipher(
    key,
    Buffer.from(cipherMeta.iv, crypt.b64)
  );
  decipher.setAuthTag(Buffer.from(cipherMeta.tag, crypt.b64));
  cipherMeta.aad && decipher.setAAD(Buffer.from(cipherMeta.aad, crypt.b64));

  let decrypted = decipher.update(encrypted, crypt.b64, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
