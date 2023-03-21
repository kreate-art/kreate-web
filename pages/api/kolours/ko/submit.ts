import { C, Core, Lucid, TxComplete, TxSigned } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_PRODUCER_PRIVATE_KEY,
} from "@/modules/env/kolours/server";
import { Kolour, KO_LOCK_PREFIX, Quotation } from "@/modules/kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, lucid$, redis } from "@/modules/next-backend/connections";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(KOLOURS_HMAC_SECRET, "kolours disabled");

    ClientError.assert(req.method === "POST", {
      _debug: "invalid http method",
    });
    ClientError.assert(req.body, { _debug: "invalid body" });

    const { tx: txHex, quotation: quot, signature } = req.body;

    ClientError.assert(quot && typeof quot === "object", {
      _debug: "invalid quotation",
    });
    ClientError.assert(
      signature &&
        typeof signature === "string" &&
        signature === crypt.hmacSign(512, KOLOURS_HMAC_SECRET, { json: quot }),
      {
        _debug: "invalid signature",
      }
    );
    ClientError.assert(txHex && typeof txHex === "string", {
      _debug: "invalid tx serialization",
    });

    const quotation = quot as Quotation; // It passed the signature check
    ClientError.assert(Date.now() <= quotation.expiration * 1000, {
      _debug: "expired",
    });

    const lucid = await lucid$();

    const tx = C.Transaction.from_bytes(Buffer.from(txHex, "hex"));
    ClientError.assert(isTxValid(tx, quotation), { _debug: "invalid tx" });

    const txBody = tx.body();

    const txExp = getTxExp(lucid, txBody);
    ClientError.assert(txExp, { _debug: "invalid tx time" });

    const txId = C.hash_transaction(txBody).to_hex();

    const kolours = Object.keys(quotation.kolours);
    await attemptMultiLock(kolours, txId);
    try {
      await expireMultiLock(kolours, 86400); // 1 day
      const records = Object.entries(quotation.kolours).map(
        ([kolour, listing]) => ({
          kolour,
          status: "booked",
          txId,
          txExpSlot: txExp.slot,
          txExpTime: txExp.time,
          fee: listing.fee,
          imageCid: listing.image.replace("ipfs://", ""),
          userAddress: quotation.userAddress,
          feeAddress: quotation.feeAddress,
          referral: quotation.referral ?? null,
        })
      );
      const txSigned = await signTx(lucid, tx);
      try {
        const submittedTxId = await txSigned.submit();
        if (submittedTxId !== txId) console.warn("Tx Id mismatch");
      } catch (submitError) {
        const errorMessage =
          submitError instanceof Error ? submitError.message : submitError;
        throw new ClientError({ _debug: { submit: errorMessage } });
      }
      await db`INSERT INTO kolours.kolour_book ${db(records)}`; // Will throw if duplicated
      sendJson(res, { txId, tx: txSigned.toString() });
    } catch (bookError) {
      try {
        await releaseMultiLock(kolours, txId);
      } catch (rollbackError) {
        console.error("error while rollback...", rollbackError);
      }
      throw bookError;
    }
  } catch (apiError) {
    apiCatch(req, res, apiError);
  }
}

function isTxValid(_tx: Core.Transaction, _quotation: Quotation) {
  // TODO: Fill me
  return true;
}

function getTxExp(lucid: Lucid, txBody: Core.TransactionBody) {
  const txTtl = txBody.ttl();
  if (txTtl == null) return null;
  const slot = Number(txTtl.to_str());
  const time = lucid.utils.slotToUnixTime(slot);
  return { slot, time };
}

async function signTx(lucid: Lucid, tx: Core.Transaction): Promise<TxSigned> {
  assert(KOLOURS_PRODUCER_PRIVATE_KEY, "kolours disabled!");
  // TODO: Load via Vault / SSM
  const txComplete = new TxComplete(lucid, tx);
  return txComplete.signWithPrivateKey(KOLOURS_PRODUCER_PRIVATE_KEY).complete();
}

async function attemptMultiLock(kolours: Kolour[], identifier: string) {
  return !!(await redis.msetnx(
    ...kolours.flatMap((k) => [KO_LOCK_PREFIX + k, identifier])
  ));
}

async function expireMultiLock(kolours: Kolour[], ttl: number) {
  const mul = redis.multi({ pipeline: true });
  for (const kolour of kolours) mul.expire(KO_LOCK_PREFIX + kolour, ttl);
  const replies = await mul.exec();
  assert(replies, "multi pipeline: replies must not be null");
  for (const [err, _] of replies) if (err) throw err;
}

async function releaseMultiLock(kolours: Kolour[], identifier: string) {
  // TODO: Less dangerous locking?
  const mul = redis.multi({ pipeline: true });
  for (const kolour of kolours) mul.delif(KO_LOCK_PREFIX + kolour, identifier);
  const replies = await mul.exec();
  assert(replies, "multi pipeline: replies must not be null");
  let released = 0;
  for (const [error, result] of replies) {
    if (error) throw error;
    released += typeof result === "number" ? result : 0;
  }
  const total = kolours.length;
  if (total !== released)
    console.warn(`can only release: ${released} / ${total}`);
  return released;
}
