import { C, Core, Lucid, TxComplete, TxSigned } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_PRODUCER_PRIVATE_KEY,
} from "@/modules/env/kolours/server";
import { areKoloursAvailable, KolourQuotation } from "@/modules/kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { db, lucid$ } from "@/modules/next-backend/connections";
import { postgres } from "@/modules/next-backend/db";

const sql = db;

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

    const quotation = quot as KolourQuotation; // It passed the signature check
    ClientError.assert(Date.now() <= quotation.expiration * 1000, {
      _debug: "expired",
    });

    ClientError.assert(
      await areKoloursAvailable(sql, Object.keys(quotation.kolours)),
      { _debug: "kolours are unavailable" }
    );

    const lucid = await lucid$();

    const tx = C.Transaction.from_bytes(Buffer.from(txHex, "hex"));
    ClientError.assert(isTxValid(tx, quotation), { _debug: "invalid tx" });

    const txBody = tx.body();

    const txExp = getTxExp(lucid, txBody);
    ClientError.assert(txExp, { _debug: "invalid tx time" });

    const txId = C.hash_transaction(txBody).to_hex();

    const records = Object.entries(quotation.kolours).map(
      ([kolour, entry]) => ({
        kolour,
        status: "booked",
        txId,
        txExpSlot: txExp.slot,
        txExpTime: txExp.time,
        fee: entry.fee,
        listedFee: entry.listedFee,
        imageCid: entry.image.replace("ipfs://", ""),
        userAddress: quotation.userAddress,
        feeAddress: quotation.feeAddress,
        referral: quotation.referral ?? null,
      })
    );

    const txSigned = await signTx(lucid, tx);
    try {
      // This acts as a multi lock due to the UNIQUE constraint
      await sql`
        INSERT INTO kolours.kolour_book ${sql(records)}
      `;
    } catch (lockError) {
      if (
        lockError instanceof postgres.PostgresError &&
        lockError.code === "23505"
      )
        throw new ClientError({ _debug: "kolours are not available anymore" });
      else throw lockError;
    }
    try {
      const submittedTxId = await txSigned.submit();
      if (submittedTxId !== txId) console.warn("Tx Id mismatch");
    } catch (submitError) {
      try {
        const deleted = await sql`
          DELETE FROM kolours.kolour_book
            WHERE tx_id = ${txId}
        `;
        if (deleted.count !== records.length)
          console.warn(
            `revert mismatched: ${deleted.count} =/= ${records.length}`
          );
      } catch (revertError) {
        console.error("revert error", revertError);
      }
      const errorMessage =
        submitError instanceof Error ? submitError.message : submitError;
      throw new ClientError({ _debug: { submit: errorMessage } });
    }
    sendJson(res, { txId, tx: txSigned.toString() });
  } catch (apiError) {
    apiCatch(req, res, apiError);
  }
}

function isTxValid(_tx: Core.Transaction, _quotation: KolourQuotation) {
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
