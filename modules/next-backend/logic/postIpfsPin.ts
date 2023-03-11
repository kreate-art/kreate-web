import { Readable } from "node:stream";

import busboy from "busboy";
import { NextApiRequest } from "next";

import { ipfs } from "../connections";

import { MaybePromise } from "@/modules/async-utils";

export type Cid = string;

export type PinResult = { cid: Cid; size: number };

export async function pinToIpfs(
  req: NextApiRequest,
  transform?: (file: Readable) => MaybePromise<Readable>
): Promise<PinResult> {
  return new Promise((resolve, reject) => {
    const processFile = async (file: Readable) => {
      const stream = transform ? await transform(file) : file;
      const { cid, size } = await ipfs.add(stream, { pin: true });
      return { cid: cid.toString(), size };
    };

    let numProcessedFiles = 0;

    const bb = busboy({ headers: req.headers });

    bb.on("file", (name, file) => {
      if (name !== "data") {
        reject(new Error("name must be 'data'"));
        file.resume(); // https://github.com/mscdex/busboy#special-parser-stream-events
      } else if (numProcessedFiles > 0) {
        reject(new Error("only accept at most one file"));
        file.resume(); // https://github.com/mscdex/busboy#special-parser-stream-events
      } else {
        numProcessedFiles += 1;
        processFile(file).then(resolve).catch(reject);
      }
    });
    bb.on("close", () => {
      if (numProcessedFiles !== 1) reject(new Error("accept exactly one file"));
    });
    bb.on("error", reject);
    req.pipe(bb);
  });
}
