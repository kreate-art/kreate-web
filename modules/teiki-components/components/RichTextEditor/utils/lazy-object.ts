import { JSONContent } from "@tiptap/core";

/**
 * editor.getJSON() is a heavy computation.
 * Complexity: O(N) where N is the number of nodes.
 * We want a lazy object so that the computation is only executed when needed.
 */
export function toLazyJSONContent(computation: () => JSONContent): JSONContent {
  let result: JSONContent | undefined = undefined;

  const force = () => {
    if (result) {
      return result;
    } else {
      return (result = computation());
    }
  };

  return {
    get type() {
      return force().type;
    },
    get attrs() {
      return force().attrs;
    },
    get content() {
      return force().content;
    },
    get marks() {
      return force().marks;
    },
    get text() {
      return force().text;
    },
  };
}
