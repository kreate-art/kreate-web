// This module is safe to load in front-end code

export type Base64 = string;

export type KeyType = "content" | "hmac";
export type KeyId = string;

// TODO: Update format later...
export type CipherMeta = {
  enc: "proto";
  kid: KeyId;
  iv: Base64;
  aut: Base64; // Because GCM
  // TODO: Make use of AAD also...
};
