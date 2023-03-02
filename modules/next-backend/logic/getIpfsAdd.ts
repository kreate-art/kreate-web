import { Readable } from "stream";

import busboy from "busboy";
import * as IpfsHttpClient from "ipfs-http-client";
import { NextApiRequest } from "next";

import { IPFS_HTTP_API_ORIGIN } from "../../../config/server";

const ipfsClient = IpfsHttpClient.create({ url: IPFS_HTTP_API_ORIGIN });

type Result = { cid: string; size: number };

export async function pinToIpfs(req: NextApiRequest): Promise<Result> {
  return new Promise<Result>((resolve, reject) => {
    let numProcessedFiles = 0;

    const processFile = async (file: Readable) => {
      const { cid, size } = await ipfsClient.add(file, { pin: true });
      return { cid: cid.toString(), size };
    };

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
      if (numProcessedFiles !== 1) {
        reject(new Error("accept exactly one file"));
      }
    });
    bb.on("error", reject);
    req.pipe(bb);
  });
}
