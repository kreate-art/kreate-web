import { JSONContent } from "@tiptap/core";

import { concat, pure, WithBufs } from "../../types/WithBufs";
import { arrayBufferToSha256 } from "../buffer";

import { assert } from "@/modules/common-utils";

type Attrs = Record<string, unknown>;

export async function fromUrl(url: string): Promise<WithBufs<string>> {
  if (!url.startsWith("blob:")) return pure(url);
  const response = await fetch(url);
  const blob = await response.blob();
  const buf = await blob.arrayBuffer();
  const sha256 = await arrayBufferToSha256(buf);
  return { data: "sha256:" + sha256, bufs: { [sha256]: buf } };
}

export function toUrl({ data, bufs }: WithBufs<string>): string {
  const matches = /^sha256:([0-9a-fA-F]+)$/.exec(data);
  if (!matches) return data;
  const sha256 = matches[1];
  const arrayBuffer = bufs[sha256];
  assert(arrayBuffer, `cannot resolve key: ${sha256}`);
  const blob = new Blob([arrayBuffer]);
  const url = URL.createObjectURL(blob);
  return url;
}

export async function fromArray<T>(
  array: T[],
  fromFn: (value: T) => Promise<WithBufs<T>>
): Promise<WithBufs<T[]>> {
  return concat(await Promise.all(array.map((item) => fromFn(item))));
}

export function toArray<T>(
  { data, bufs }: WithBufs<T[]>,
  toFn: (item: WithBufs<T>) => T
): T[] {
  return data.map((item) => toFn({ data: item, bufs }));
}

export async function fromAttrs({
  src,
  ...others
}: Attrs): Promise<WithBufs<Attrs>> {
  // Note: You might be tempted to apply this rule to not only `src`
  // but all other fields. If so, think about `srcset`.
  const srcWB = typeof src === "string" ? await fromUrl(src) : pure(src);
  return {
    data: { src: srcWB.data, ...others },
    bufs: srcWB.bufs,
  };
}

export function toAttrs({
  data: { src, ...others },
  bufs,
}: WithBufs<Attrs>): Attrs {
  return {
    src: typeof src === "string" ? toUrl({ data: src, bufs }) : src,
    ...others,
  };
}

export async function fromJSONContent({
  content,
  attrs,
  ...others
}: JSONContent): Promise<WithBufs<JSONContent>> {
  const contentWB = content
    ? await fromArray(content, fromJSONContent)
    : pure(content);
  const attrsWB = attrs ? await fromAttrs(attrs) : pure(attrs);
  return {
    data: { attrs: attrsWB.data, content: contentWB.data, ...others },
    bufs: { ...attrsWB.bufs, ...contentWB.bufs },
  };
}

export function toJSONContent({
  data: { attrs, content, ...others },
  bufs,
}: WithBufs<JSONContent>): JSONContent {
  return {
    attrs: attrs ? toAttrs({ data: attrs, bufs }) : attrs,
    content: content
      ? toArray({ data: content, bufs }, toJSONContent)
      : content,
    ...others,
  };
}
