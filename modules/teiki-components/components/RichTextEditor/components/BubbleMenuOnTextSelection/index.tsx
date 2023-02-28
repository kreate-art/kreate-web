import { Editor, isTextSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import * as React from "react";
import { Dropdown, Icon, Menu } from "semantic-ui-react";

import ModalInsertLink from "./containers/ModalInsertLink";

import { useModalPromises } from "@/modules/modal-promises";

type Props = {
  editor: Editor;
};

const NODE_TYPES = [
  { title: "Heading 1", name: "heading", attributes: { level: 1 } },
  { title: "Heading 2", name: "heading", attributes: { level: 2 } },
  { title: "Heading 3", name: "heading", attributes: { level: 3 } },
  { title: "Bulleted List", name: "bulletList" },
  { title: "Numbered List", name: "orderedList" },
  { title: "Code", name: "codeBlock" },
  { title: "Quote", name: "blockquote" },
  { title: "Text", name: "paragraph" },
];

export default function BubbleMenuOnTextSelection({ editor }: Props) {
  const { showModal } = useModalPromises();
  const nodeType = NODE_TYPES.find(({ name, attributes }) =>
    editor.isActive(name, attributes)
  );

  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ placement: "top", maxWidth: "none" }}
        shouldShow={({ state }) =>
          isTextSelection(state.selection) && !state.selection.empty
        }
      >
        <Menu color="grey" compact borderless>
          {nodeType && (
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
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                />
                <Dropdown.Item
                  content="Numbered List"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
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
          )}
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
          <Menu.Item
            icon="linkify"
            onClick={() => {
              /**
               * TODO: @sk-tenba: this component should be updated to be suitable
               * for entering url.
               */
              showModal<void>((resolve) => (
                <ModalInsertLink
                  open={true}
                  editor={editor}
                  onClose={resolve}
                />
              ));
            }}
            active={editor.isActive("link")}
            title="Add external link"
          />
          <Dropdown
            item
            trigger={
              <Icon
                name={
                  editor.isActive({ textAlign: "center" })
                    ? "align center"
                    : editor.isActive({ textAlign: "right" })
                    ? "align right"
                    : "align left"
                }
              />
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                active={editor.isActive({ textAlign: "left" })}
                text="Align left"
              />
              <Dropdown.Item
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                active={editor.isActive({ textAlign: "center" })}
                text="Align center"
              />
              <Dropdown.Item
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                active={editor.isActive({ textAlign: "right" })}
                text="Align right"
              />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item trigger={<Icon name="font" />} title="Text color">
            <Dropdown.Menu>
              <Dropdown.Item
                content="Default"
                onClick={() => editor.chain().focus().unsetColor().run()}
              />
              <Dropdown.Item
                content="Grey"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setColor("rgba(120, 119, 116, 1)")
                    .run()
                }
              />
              <Dropdown.Item
                content="Brown"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(159, 107, 83, 1)").run()
                }
              />
              <Dropdown.Item
                content="Orange"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(217, 115, 13, 1)").run()
                }
              />
              <Dropdown.Item
                content="Yellow"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(203, 145, 47, 1)").run()
                }
              />
              <Dropdown.Item
                content="Green"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(68, 131, 97, 1)").run()
                }
              />
              <Dropdown.Item
                content="Blue"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(51, 126, 169, 1)").run()
                }
              />
              <Dropdown.Item
                content="Purple"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .setColor("rgba(144, 101, 176, 1)")
                    .run()
                }
              />
              <Dropdown.Item
                content="Pink"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(193, 76, 138, 1)").run()
                }
              />
              <Dropdown.Item
                content="Red"
                onClick={() =>
                  editor.chain().focus().setColor("rgba(212, 76, 71, 1)").run()
                }
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
      </BubbleMenu>
    </>
  );
}
