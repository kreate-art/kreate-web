// In compliance with:
// [TD] Guidelines on using Server Side Props
// https://www.notion.so/shinka-network/48551043ee154ae0bac21ea0625d0cf3

export type ResourceKey = [string, ...unknown[]];

export const prefixes = {
  price: ["price"],
  protocol: ["protocol"],
} as const;

export function checkPrefix(prefix: string[], key: unknown) {
  if (!Array.isArray(key)) return false;
  return prefix.every((item, index) => key[index] === item);
}
