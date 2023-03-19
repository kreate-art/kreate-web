import { AddressDetails, Lucid } from "lucid-cardano";

import * as Auth from "@/modules/authorization";
import { Address, LovelaceAmount } from "@/modules/business-types";

export type WalletName =
  | "nami"
  | "cardwallet"
  | "nufi"
  | "eternl"
  | "flint"
  | "gerowallet"
  | "typhoncip30"
  | string;

/**
 * A readonly-and-serializable object containing the wallet info.
 */
export type WalletInfo = {
  walletName: WalletName;
  lovelaceAmount: LovelaceAmount;
  address: Address;
  addressDetails: AddressDetails;
};

export type WalletStatus =
  | { status: "unknown" }
  | { status: "connecting"; walletName: WalletName }
  | {
      status: "connected";
      info: WalletInfo;
      lucid: Lucid;
    }
  | { status: "disconnected" };
