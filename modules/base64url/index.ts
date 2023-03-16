import { Base64 } from "../crypt";

function unescape(str: string) {
  return (str + "===".slice((str.length + 3) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
}

function escape(str: string) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encode(bytes: Buffer): Base64 {
  return escape(bytes.toString("base64"));
}

function decode(text: Base64): Buffer {
  return Buffer.from(unescape(text), "base64");
}

const exports = { encode, decode, escape, unescape };

export default exports;
