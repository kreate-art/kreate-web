import { Editor } from "@tiptap/core";
import { findParentNodeClosestToPos } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { Dropdown, Menu } from "semantic-ui-react";

import styles from "./index.module.scss";

type Props = {
  editor: Editor;
};

export default function BubbleMenuOnTableSelection({ editor }: Props) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ placement: "top", maxWidth: "none" }}
      shouldShow={({ state }) => {
        return (
          findParentNodeClosestToPos(
            state.doc.resolve(state.selection.from),
            (node) => node.type.name === "table"
          ) !== undefined && state.selection.empty
        );
      }}
    >
      <Menu compact borderless>
        <Dropdown text="Row" className={styles.dropdown}>
          <Dropdown.Menu>
            <Dropdown.Item
              name="add-row-before"
              text="Add row before"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            />
            <Dropdown.Item
              name="add-row-after"
              text="Add row after"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            />
            <Dropdown.Item
              name="delete-row"
              text="Delete row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Column" compact className={styles.dropdown}>
          <Dropdown.Menu>
            <Dropdown.Item
              name="add-column-before"
              text="Add column before"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            />
            <Dropdown.Item
              name="add-column-after"
              text="Add column after"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            />
            <Dropdown.Item
              name="delete-column"
              text="Delete column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item
          name="delete-table"
          title="Delete table"
          onClick={() => editor.chain().focus().deleteTable().run()}
        />
      </Menu>
    </BubbleMenu>
  );
}
