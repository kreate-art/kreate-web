import CodecBlob from "./codecs/CodecBlob";
import * as Converters$Base from "./converters/base";
import * as Converters$JSONContent from "./converters/json-content";
import * as Converters$Project from "./converters/project";

export type { Url, Codec, FromFn, ToFn } from "./types";

export const Codecs = {
  CodecBlob,
};

export const Converters = {
  ...Converters$Base,
  ...Converters$JSONContent,
  ...Converters$Project,
};

export { CodecError } from "./errors";
