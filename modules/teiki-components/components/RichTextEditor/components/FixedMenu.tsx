import { Editor } from "@tiptap/core";
import * as React from "react";
import { Dropdown, Menu } from "semantic-ui-react";

type Props = {
  editor: Editor;
};

type NodeType = {
  title: string;
  name: string;
  attributes?: Record<string, unknown>;
};

const NODE_TYPES: NodeType[] = [
  { title: "Heading 1", name: "heading", attributes: { level: 1 } },
  { title: "Heading 2", name: "heading", attributes: { level: 2 } },
  { title: "Heading 3", name: "heading", attributes: { level: 3 } },
  { title: "Bulleted List", name: "bulletList" },
  { title: "Numbered List", name: "orderedList" },
  { title: "Code", name: "codeBlock" },
  { title: "Quote", name: "blockquote" },
  { title: "Text", name: "paragraph" },
];

export default function FixedMenu({ editor }: Props) {
  const nodeType = NODE_TYPES.find(({ name, attributes }) =>
    editor.isActive(name, attributes)
  );

  return (
    <>
      <Menu secondary>
        <Dropdown
          item
          text={nodeType ? nodeType.title : ""}
          style={{ minWidth: "10em" }}
          disabled={!nodeType}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => editor.chain().focus().setParagraph().run()}
              content="Text"
            />
            <Dropdown.Item
              content="Heading 1"
              onClick={() =>
                editor.chain().focus().setHeading({ level: 1 }).run()
              }
            />
            <Dropdown.Item
              content="Heading 2"
              onClick={() =>
                editor.chain().focus().setHeading({ level: 2 }).run()
              }
            />
            <Dropdown.Item
              content="Heading 3"
              onClick={() =>
                editor.chain().focus().setHeading({ level: 3 }).run()
              }
            />
            <Dropdown.Item
              content="Bulleted List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <Dropdown.Item
              content="Numbered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <Dropdown.Item
              content="Code"
              onClick={() => editor.chain().focus().setCodeBlock().run()}
            />
            <Dropdown.Item
              content="Quote"
              onClick={() => editor.chain().focus().setBlockquote().run()}
            />
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item
          icon="bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        />
        <Menu.Item
          icon="italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italicize"
        />
        <Menu.Item
          icon="strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strikethrough")}
          title="Strike-through"
        />
        <Menu.Item
          icon="code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Mark as code"
        />
      </Menu>
    </>
  );
}
