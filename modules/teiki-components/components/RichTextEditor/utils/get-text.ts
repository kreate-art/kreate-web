import { generateText, JSONContent, TextSerializer } from "@tiptap/core";

import { editorExtensions } from "../config";

import { try$ } from "@/modules/async-utils";
import { mapValues } from "@/modules/with-bufs-as";

type MaybePromise<T> = Promise<T> | T;

type TextSerializer$Props = TextSerializer extends (props: infer P) => unknown
  ? P
  : never;

/**
 * Similar to `generateText`, but `textSerializers` contains async functions.
 */
export async function getText(
  doc: JSONContent,
  textSerializers: {
    [type: string]: (props: TextSerializer$Props) => MaybePromise<string>;
  }
): Promise<string> {
  // 1. Collect all the inputs that we will see when calling `generateText`
  const inputs: TextSerializer$Props[] = [];

  generateText(doc, editorExtensions, {
    textSerializers: mapValues(textSerializers, () => (input) => {
      inputs.push(input);
      return "";
    }),
  });

  // 2. For each input, we use our `textSerializers` to precompute the results

  const getKey = ({ node, pos, range }: TextSerializer$Props) => {
    return `${node.type.name}:${pos}:${range.from}:${range.to}`;
  };

  const pairsOfInputKeyAndOutput = await Promise.all(
    inputs.map(async (input) => {
      const serializer = textSerializers[input.node.type.name];
      const inputKey = getKey(input);
      const output = await try$(
        async () => (serializer ? await serializer(input) : ""),
        (error) => {
          // intentionally ignore errors
          console.error(error);
          return "";
        }
      );
      return [inputKey, output] as const;
    })
  );

  const precomputedResults = Object.fromEntries(pairsOfInputKeyAndOutput);

  // 3. Run `generateText` again, using `precomputedResults` to answer queries

  return generateText(doc, editorExtensions, {
    textSerializers: mapValues(textSerializers, () => (input) => {
      const inputKey = getKey(input);
      return precomputedResults[inputKey] || "";
    }),
  });
}
