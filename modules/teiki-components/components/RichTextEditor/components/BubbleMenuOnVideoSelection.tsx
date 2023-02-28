import { Editor, isNodeSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { Menu } from "semantic-ui-react";

type Props = {
  editor: Editor;
};

export default function BubbleMenuOnVideoSelection({ editor }: Props) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ placement: "top", maxWidth: "none" }}
      shouldShow={({ state }) =>
        isNodeSelection(state.selection) &&
        !state.selection.empty &&
        state.selection.node.type.name === "video"
      }
    >
      <Menu compact borderless>
        <Menu.Item
          icon="zoom in"
          title="Increase size"
          onClick={() => editor.chain().focus().autoIncreaseVideoSize().run()}
        />
        <Menu.Item
          icon="zoom out"
          title="Decrease size"
          onClick={() => editor.chain().focus().autoDecreaseVideoSize().run()}
        />
        <Menu.Item
          icon="trash alternate"
          title="Delete"
          onClick={() => editor.chain().focus().deleteSelection().run()}
        />
      </Menu>
    </BubbleMenu>
  );
}
