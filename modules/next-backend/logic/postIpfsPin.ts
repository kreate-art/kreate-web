import stream from "node:stream";

import busboy from "busboy";
import { NextApiRequest } from "next";

import { ClientError } from "../api/errors";
import { ipfs } from "../connections";

export type Cid = string;

export type PinResult = { cid: Cid };

const FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

type BusboyFile = stream.Readable & { truncated?: boolean };

export async function pinToIpfs(
  req: NextApiRequest,
  transform?: (file: BusboyFile) => stream.Readable
): Promise<PinResult> {
  return new Promise((resolve, reject) => {
    const store = async (file: BusboyFile) => {
      const stream = transform ? transform(file) : file;
      const { cid } = await ipfs.add(stream, { pin: true });
      if (file.truncated) {
        // A bad workaround...
        await ipfs.pin.rm(cid);
        console.log(`Unpinned ${cid}`);
        for await (const r of ipfs.block.rm(cid)) {
          if (r.error)
            console.warn(
              `Failed to remove block ${r.cid} due to ${r.error.message}`
            );
          else console.log(`Removed block ${r.cid}`);
        }
        throw error("file size limit exceeded: reverted");
      } else {
        return { cid: cid.toString() };
      }
    };

    const bb = busboy({
      headers: req.headers,
      limits: { fields: 0, files: 1, parts: 1, fileSize: FILE_SIZE_LIMIT },
    })
      .on("file", (_name, file: BusboyFile, _info) =>
        store(file).then(resolve, reject)
      )
      .on("limit", () => reject(error("file size limit exceeded: rejected")))
      .on("partsLimit", () => reject(error("only allow 1 part")))
      .on("filesLimit", () => reject(error("only allow 1 file")))
      .on("fieldsLimit", () => reject(error("only allow files")))
      .on("error", reject);

    stream.pipeline(req, bb, (error) => error && reject(error));
  });
}

function error(message: string, status?: undefined) {
  return new ClientError({ _debug: message }, status);
}
