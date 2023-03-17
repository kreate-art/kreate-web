import { get } from "idb-keyval";

import { WalletInfo } from "../types";

import { SavedAuthInfo } from "@/modules/authorization";
import * as Auth from "@/modules/authorization";
import { assert } from "@/modules/common-utils";
import { fromJson, toJson } from "@/modules/json-utils";

/**
 * Saves wallet info to `localStorage`.
 *
 * If `walletInfo` is `null`, clears the memory instead.
 */
export function saveWalletInfo(
  storageKey: string,
  walletInfo: WalletInfo | null
) {
  if (!walletInfo) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, toJson(walletInfo));
  }
}

/**
 * Checks if `obj` is a valid `WalletInfo`
 *
 * NOTE: We are using a light type-check instead of a strict one.
 */
export function isWalletInfo(obj: unknown): obj is WalletInfo {
  if (!obj || typeof obj !== "object") return false;
  return (
    "walletName" in obj &&
    "lovelaceAmount" in obj &&
    "address" in obj &&
    "addressDetails" in obj
  );
}

/**
 * Loads wallet info from `localStorage`.
 *
 * Returns `null` if not found.
 */
export function loadWalletInfo(storageKey: string): WalletInfo | null {
  try {
    const text = localStorage.getItem(storageKey);
    assert(typeof text === "string" && text.startsWith("{"));
    const obj = fromJson(text);
    assert(isWalletInfo(obj));
    return obj;
  } catch {
    return null;
  }
}

/**
 * Loads wallet info from `Storage`.
 *
 * Returns `null` if not found.
 */
export async function loadSavedAuthInfo(): Promise<SavedAuthInfo | null> {
  try {
    return (await get(Auth.getStorageKey())) as Auth.SavedAuthInfo;
  } catch {
    return null;
  }
}
