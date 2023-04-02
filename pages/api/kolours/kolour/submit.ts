import { randomUUID } from "crypto";

import { KolourQuotation } from "@kreate/protocol/schema/teiki/kolours";
import { verifyKolourNftMintingTx } from "@kreate/protocol/transactions/kolours/kolour-nft";
import { Address, C, Core, Lucid, TxComplete, TxSigned } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import { KOLOURS_KOLOUR_NFT_POLICY_ID } from "@/modules/env/kolours/client";
import {
  KOLOURS_HMAC_SECRET,
  KOLOURS_KOLOUR_NFT_PRESENT_ADDRESS,
  KOLOURS_KOLOUR_NFT_PRIVATE_KEY,
} from "@/modules/env/kolours/server";
import { getTxExp } from "@/modules/kolours/common";
import { KOLOUR_USER_LOCK_PREFIX } from "@/modules/kolours/keys";
import {
  areKoloursAvailable,
  areKoloursAvailableForOpenMint,
  checkFreeMintAvailability,
} from "@/modules/kolours/kolour";
import { Kolour, KolourQuotationSource } from "@/modules/kolours/types/Kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { parseBody, sendJson } from "@/modules/next-backend/api/helpers";
import { db, lucid$ } from "@/modules/next-backend/connections";
import { postgres, Sql } from "@/modules/next-backend/db";
import locking from "@/modules/next-backend/locking";

export const config = { api: { bodyParser: false } };

const sql = db;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assert(KOLOURS_HMAC_SECRET, "kolour nft disabled");

    ClientError.assert(req.method === "POST", {
      _debug: "invalid http method",
    });

    const body = await parseBody(req);
    ClientError.assert(body, { _debug: "invalid body" });
    const { quotation: quot, signature, tx: txHex } = body;

    ClientError.assert(quot && typeof quot === "object", {
      _debug: "invalid quotation",
    });
    ClientError.assert(
      signature &&
        typeof signature === "string" &&
        signature ===
          crypt.hmacSign(512, KOLOURS_HMAC_SECRET, { json: { kolour: quot } }),
      {
        _debug: "invalid signature",
      }
    );
    ClientError.assert(txHex && typeof txHex === "string", {
      _debug: "invalid tx serialization",
    });

    // TODO: Check quotation format
    const quotation = quot as KolourQuotation; // It passed the signature check
    ClientError.assert(Date.now() <= quotation.expiration * 1000, {
      _debug: "expired",
    });

    const lucid = await lucid$();

    const tx = C.Transaction.from_bytes(Buffer.from(txHex, "hex"));
    const txBody = tx.body();
    const txExp = getTxExp(lucid, txBody);
    ClientError.assert(txExp, { _debug: "invalid tx time" });
    const txId = C.hash_transaction(txBody).to_hex();

    verifyKolourNftMintingTx(lucid, {
      tx,
      quotation,
      kolourNftMph: KOLOURS_KOLOUR_NFT_POLICY_ID,
      txId,
      txBody,
      txExp: txExp.time,
    });

    const { source, referral, kolours, userAddress, feeAddress } = quotation;

    const sourceDbCols =
      source.type === "genesis_kreation"
        ? { source: source.type, sourceId: source.kreation }
        : { source: source.type };

    const records = Object.entries(kolours)
      // Deterministic ordering helps with avoiding deadlocks
      .sort(([k1, _1], [k2, _2]) => (k1 < k2 ? -1 : 1))
      .map(([kolour, entry]) => ({
        kolour: kolour,
        status: "booked",
        ...sourceDbCols,
        txId,
        txExpSlot: txExp.slot,
        txExpTime: txExp.time,
        fee: entry.fee,
        listedFee: entry.listedFee,
        imageCid: entry.image.replace("ipfs://", ""),
        userAddress,
        feeAddress,
        referral: referral?.id ?? null,
      }));

    const userLock = await acquireLockIfNeeded(source, userAddress);
    try {
      await checkAvailability(sql, source, userAddress, Object.keys(kolours));

      const txSigned = await signTx(lucid, tx);
      try {
        await sql.begin((sql) => [
          sql`SET LOCAL lock_timeout = '2s'`,
          // This acts as a multi lock due to the UNIQUE constraint
          sql`INSERT INTO kolours.kolour_book ${sql(records)}`,
        ]);
      } catch (lockError) {
        if (
          lockError instanceof postgres.PostgresError &&
          lockError.code === "23505"
        )
          throw new ClientError({
            _debug: "kolours are not available anymore",
          });
        else throw lockError;
      }
      try {
        const submittedTxId = await txSigned.submit();
        if (submittedTxId !== txId) console.warn("tx id mismatch");
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
    } finally {
      await userLock?.release();
    }
  } catch (apiError) {
    apiCatch(req, res, apiError);
  }
}

async function signTx(lucid: Lucid, tx: Core.Transaction): Promise<TxSigned> {
  assert(KOLOURS_KOLOUR_NFT_PRIVATE_KEY, "kolour nft disabled");
  // TODO: Load keys via Vault / SSM
  return new TxComplete(lucid, tx)
    .signWithPrivateKey(KOLOURS_KOLOUR_NFT_PRIVATE_KEY)
    .complete();
}

async function checkAvailability(
  sql: Sql,
  source: KolourQuotationSource,
  address: Address,
  kolours: Kolour[]
): Promise<void> {
  switch (source.type) {
    case "free":
      return checkFreeMintAvailability(sql, address, kolours);
    case "genesis_kreation":
      return ClientError.assert(await areKoloursAvailable(sql, kolours), {
        _debug: "kolours are unavailable",
      });
    case "present":
      ClientError.assert(
        KOLOURS_KOLOUR_NFT_PRESENT_ADDRESS &&
          address === KOLOURS_KOLOUR_NFT_PRESENT_ADDRESS,
        { _debug: "address isn't elible for present mint" }
      );
      ClientError.assert(await areKoloursAvailableForOpenMint(db, kolours), {
        _debug: "kolours are unavailable for present mint",
      });
  }
}

async function acquireLockIfNeeded(
  source: KolourQuotationSource,
  address: Address
) {
  return source.type === "free"
    ? await locking.acquire(
        KOLOUR_USER_LOCK_PREFIX + address,
        randomUUID(),
        { ttl: 10 },
        1000
      )
    : null;
}
