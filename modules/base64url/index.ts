function unescape(str: string) {
  return (str + "===".slice((str.length + 3) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
}

function escape(str: string) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encode(text: string, encoding?: BufferEncoding) {
  return escape(Buffer.from(text, encoding || "utf8").toString("base64"));
}

function decode(b64: string, encoding?: BufferEncoding) {
  return Buffer.from(unescape(b64), "base64").toString(encoding || "utf8");
}

const exports = { encode, decode, escape, unescape };

export default exports;
