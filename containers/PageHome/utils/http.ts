import { fromJson } from "@/modules/json-utils";

export async function httpGet(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return fromJson(text);
}
