import { Node, isNodeSelection } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { VideoNodeView } from "./components/VideoNodeView";
import {
  autoDecreaseSize,
  autoIncreaseSize,
  getAttrsFromSize,
  getSizeFromAttrs,
} from "./utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      autoIncreaseVideoSize: () => ReturnType;
      autoDecreaseVideoSize: () => ReturnType;
    };
  }
}

export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", HTMLAttributes];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },
  addCommands() {
    return {
      autoIncreaseVideoSize:
        () =>
        ({ state, commands }) => {
          if (!isNodeSelection(state.selection)) return false;
          const node = state.selection.node;
          if (node.type.name !== "video") return false;
          const size = getSizeFromAttrs(node.attrs);
          console.log(size);
          if (!size) return false;
          const newSize = autoIncreaseSize(size);
          return commands.updateAttributes("video", getAttrsFromSize(newSize));
        },
      autoDecreaseVideoSize:
        () =>
        ({ state, commands }) => {
          if (!isNodeSelection(state.selection)) return false;
          const node = state.selection.node;
          if (node.type.name !== "video") return false;
          const size = getSizeFromAttrs(node.attrs);
          if (!size) return false;
          const newSize = autoDecreaseSize(size);
          return commands.updateAttributes("video", getAttrsFromSize(newSize));
        },
    };
  },
});
