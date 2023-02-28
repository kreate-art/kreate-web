import { isNodeSelection, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ImageNodeView } from "./components/ImageNodeView";
import { autoDecreaseSize, autoIncreaseSize, getSizeFromAttrs } from "./utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      autoIncreaseImageSize: () => ReturnType;
      autoDecreaseImageSize: () => ReturnType;
      insertImage: (params: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

export const Image = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null, isRequired: true },
      alt: { default: null },
      title: { default: null },
      width: { default: null }, // number, displayed width
      height: { default: null }, // number, displayed height
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", HTMLAttributes];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
  addCommands() {
    return {
      autoIncreaseImageSize:
        () =>
        ({ state, commands }) => {
          if (!isNodeSelection(state.selection)) return false;
          const node = state.selection.node;
          if (node.type.name !== "image") return false;
          const size = getSizeFromAttrs(node.attrs);
          if (!size) return false;
          const newSize = autoIncreaseSize(size);
          return commands.updateAttributes("image", {
            width: newSize.width,
            height: newSize.height,
          });
        },
      autoDecreaseImageSize:
        () =>
        ({ state, commands }) => {
          if (!isNodeSelection(state.selection)) return false;
          const node = state.selection.node;
          if (node.type.name !== "image") return false;
          const size = getSizeFromAttrs(node.attrs);
          if (!size) return false;
          const newSize = autoDecreaseSize(size);
          return commands.updateAttributes("image", {
            width: newSize.width,
            height: newSize.height,
          });
        },
      insertImage:
        ({ src, alt, width, height }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "image",
            attrs: { src, alt, width, height },
          });
        },
    };
  },
});
