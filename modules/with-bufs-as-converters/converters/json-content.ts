import { JSONContent } from "@tiptap/core";

import { Codec, FromFn, ToFn } from "../types";

import {
  fromArray,
  fromNullable,
  fromObject,
  toArray,
  toNullable,
  toObject,
} from "./base";

import { pure } from "@/modules/with-bufs-as";

type Attrs = Partial<Record<string, unknown>>;

/**
 * Converts `Attrs` to `WithBufsAs<Attrs, V>`.
 *
 * Examples:
 * ```
 * // attrs: Attrs
 * const attrsWBA: WithBufsAs<Attrs, Blob> =
 *   await fromAttrs(CodecBlob)(attrs);
 * ```
 */
export function fromAttrs<V>(codec: Codec<V>): FromFn<Attrs, V> {
  return fromObject<Attrs, V>({
    src: async (value) =>
      typeof value === "string" ? await codec.fromUrl(value) : pure(value),
  });
}

/**
 * Converts `WithBufsAs<Attrs, V>` to `Attrs`.
 *
 * Examples:
 * ```
 * // attrsWBA: WithBufsAs<Attrs, CodecBlob>
 * const attrs: Attrs = toAttrs(CodecBlob)(attrsWBA);
 * ```
 */
export function toAttrs<V>(codec: Codec<V>): ToFn<Attrs, V> {
  return toObject<Attrs, V>({
    src: ({ data, bufs }) =>
      typeof data === "string" ? codec.toUrl({ data, bufs }) : data,
  });
}

/**
 * Converts `JSONContent` to `WithBufsAs<JSONContent, V>`.
 *
 * Examples:
 * ```
 * // jsonContent: JSONContent
 * const jsonContentWBA: WithBufsAs<JSONContent, Blob> =
 *   await fromJSONContent(CodecBlob)(jsonContent);
 * ```
 */
export function fromJSONContent<V>(codec: Codec<V>): FromFn<JSONContent, V> {
  return fromObject<JSONContent, V>({
    attrs: fromNullable(fromAttrs(codec)),
    content: fromNullable(fromArray((value) => fromJSONContent(codec)(value))),
  });
}

/**
 * Converts `WithBufsAs<JSONContent, V>` to `JSONContent`.
 *
 * Examples:
 * ```
 * // jsonContentWBA: WithBufsAs<JSONContent, CodecBlob>
 * const jsonContent: JSONContent = toJSONContent(CodecBlob)(jsonContentWBA);
 * ```
 */
export function toJSONContent<V>(codec: Codec<V>): ToFn<JSONContent, V> {
  return toObject({
    attrs: toNullable(toAttrs(codec)),
    content: toNullable(
      toArray<JSONContent, V>((value) => toJSONContent(codec)(value))
    ),
  });
}
