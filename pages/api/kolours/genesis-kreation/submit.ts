import { GenesisKreationQuotation } from "@kreate/protocol/schema/teiki/kolours";
import { verifyGKNftMintingTx } from "@kreate/protocol/transactions/kolours/genesis-kreaction-nft";
import { C, Core, Lucid, TxComplete, TxSigned } from "lucid-cardano";
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
import { GenesisKreationId } from "@/modules/kolours/types/Kolours";
import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { parseBody, sendJson } from "@/modules/next-backend/api/helpers";
import { db, lucid$ } from "@/modules/next-backend/connections";
import { postgres } from "@/modules/next-backend/db";

export const config = { api: { bodyParser: false } };

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
          crypt.hmacSign(512, KOLOURS_HMAC_SECRET, {
            json: { genesis_kreation: quot },
          }),
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
    const txBody = tx.body();
    const txExp = getTxExp(lucid, txBody);
    ClientError.assert(txExp, { _debug: "invalid tx time" });
    const txId = C.hash_transaction(txBody).to_hex();

    const metadata = extractMetadata(tx, quotation.id);

    verifyGKNftMintingTx(lucid, {
      tx,
      quotation,
      gkNftMph: KOLOURS_GENESIS_KREATION_POLICY_ID,
      ...metadata,
      txId,
      txBody,
      txExp: txExp.time,
    });

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
      name: metadata.name,
      description: metadataValueToArray(metadata.description),
      referral: quotation.referral?.id ?? null,
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
  description: string | string[];
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
  const entry = metadatum?.[KOLOURS_GENESIS_KREATION_POLICY_ID]?.[id];
  ClientError.assert(entry, { _debug: "missing genesis kreation nft entry" });
  const { name, description } = entry;
  ClientError.assert(name, { _debug: "missing genesis kreation nft name" });
  ClientError.assert(description != null, {
    _debug: "missing genesis kreation nft description",
  });
  ClientError.assert(
    typeof description === "string" ||
      (Array.isArray(description) &&
        description.every((e) => typeof e === "string")),
    { _debug: "invalid genesis kreation nft description" }
  );
  return { name, description };
}

function metadataValueToArray(value: string | string[]): string[] {
  return !value ? [] : typeof value === "string" ? [value] : value;
}
