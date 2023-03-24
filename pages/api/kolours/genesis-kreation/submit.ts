import { C, Core, fromText, Lucid, TxComplete, TxSigned } from "lucid-cardano";
import { NextApiRequest, NextApiResponse } from "next";

import { assert } from "@/modules/common-utils";
import * as crypt from "@/modules/crypt";
import { KOLOURS_GENESIS_KREATION_POLICY_ID } from "@/modules/env/kolours/client";
import {
  KOLOURS_GENESIS_KREATION_PRIVATE_KEY,
  KOLOURS_HMAC_SECRET,
} from "@/modules/env/kolours/server";
import { fromJson } from "@/modules/json-utils";
import { getTxExp } from "@/modules/kolours/common";
import { getGenesisKreationStatus } from "@/modules/kolours/genesis-kreation";
import {
  GenesisKreationId,
  GenesisKreationQuotation,
} from "@/modules/kolours/types/Kolours";
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
    assert(KOLOURS_HMAC_SECRET, "genesis kreation disabled");

    ClientError.assert(req.method === "POST", {
      _debug: "invalid http method",
    });
    ClientError.assert(req.body, { _debug: "invalid body" });

    const { tx: txHex, quotation: quotObj, signature } = req.body;

    const quot = fromJson(quotObj);
    ClientError.assert(quot && typeof quot === "object" && "id" in quot, {
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

    // TODO: Check quotation format
    const quotation = quot as GenesisKreationQuotation;
    ClientError.assert(Date.now() <= quotation.expiration * 1000, {
      _debug: "expired",
    });

    const status = await getGenesisKreationStatus(sql, quotation.id);
    switch (status) {
      case "unready":
        throw new ClientError({ _debug: "genesis kreation is not ready" });
      case "booked":
      case "minted":
        throw new ClientError({ _debug: "genesis kreation is unavailable" });
      case null:
        throw new ClientError({ _debug: "unknown genesis kreation" });
    }

    const lucid = await lucid$();

    const tx = C.Transaction.from_bytes(Buffer.from(txHex, "hex"));
    ClientError.assert(isTxValid(tx, quotation), { _debug: "invalid tx" });

    const txBody = tx.body();

    const txExp = getTxExp(lucid, txBody);
    ClientError.assert(txExp, { _debug: "invalid tx time" });

    const txId = C.hash_transaction(txBody).to_hex();

    const record = {
      kreation: quotation.id,
      status: "booked",
      txId,
      txExpSlot: txExp.slot,
      txExpTime: txExp.time,
      fee: quotation.fee,
      listedFee: quotation.listedFee,
      userAddress: quotation.userAddress,
      feeAddress: quotation.feeAddress,
      ...extractMetadata(tx, quotation.id),
      referral: quotation.referral ?? null,
    };

    const txSigned = await signTx(lucid, tx);
    try {
      // This acts as a lock due to the UNIQUE constraint
      await sql`INSERT INTO kolours.genesis_kreation_book ${sql(record)}`;
    } catch (lockError) {
      if (
        lockError instanceof postgres.PostgresError &&
        lockError.code === "23505"
      )
        throw new ClientError({
          _debug: "genesis kreation is not available anymore",
        });
      else throw lockError;
    }
    try {
      const submittedTxId = await txSigned.submit();
      if (submittedTxId !== txId) console.warn("tx id mismatch");
    } catch (submitError) {
      try {
        const deleted = await sql`
          DELETE FROM kolours.genesis_kreation_book
            WHERE tx_id = ${txId}
        `;
        if (!deleted.count)
          console.warn(`revert mismatched: ${deleted.count} = 0`);
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

function isTxValid(
  _tx: Core.Transaction,
  _quotation: GenesisKreationQuotation
) {
  // TODO: Fill me
  return true;
}

async function signTx(lucid: Lucid, tx: Core.Transaction): Promise<TxSigned> {
  assert(KOLOURS_GENESIS_KREATION_PRIVATE_KEY, "genesis kreation disabled");
  // TODO: Load keys via Vault / SSM
  return new TxComplete(lucid, tx)
    .signWithPrivateKey(KOLOURS_GENESIS_KREATION_PRIVATE_KEY)
    .complete();
}

const METADATA_NFT_TAG = C.BigNum.from_str("721");

function extractMetadata(
  tx: Core.Transaction,
  id: GenesisKreationId
): {
  name: string;
  description: string | null;
} {
  const metadatumCore = tx.auxiliary_data()?.metadata()?.get(METADATA_NFT_TAG);
  ClientError.assert(metadatumCore, { _debug: "missing tx nft metadatum" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadatum: any = fromJson(
    C.decode_metadatum_to_json_str(
      metadatumCore,
      C.MetadataJsonSchema.NoConversions
    )
  );
  const entry = metadatum?.[KOLOURS_GENESIS_KREATION_POLICY_ID]?.[fromText(id)];
  const name = entry?.name;
  const description = entry?.description ?? null;
  ClientError.assert(name, { _debug: "missing genesis kreation nft name" });
  return { name, description };
}
