import { Editor } from "@tiptap/core";
import * as TiptapReact from "@tiptap/react";
import React from "react";
import { Dropdown, Icon } from "semantic-ui-react";

import { getOptimalSize } from "../custom-nodes/Image/utils";
import { selectOneFile } from "../utils/file-dialog";

type Props = {
  editor: Editor;
};

export default function FloatingMenuOnNewLine({ editor }: Props) {
  return (
    <TiptapReact.FloatingMenu
      editor={editor}
      tippyOptions={{ placement: "left" }}
    >
      <Dropdown icon="add" basic button compact className="icon">
        <Dropdown.Menu>
          <Dropdown.Header icon="write" content="Basic blocks" />
          <Dropdown.Divider />
          <Dropdown.Item
            icon="heading"
            text="Heading 1"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertContent({ type: "heading", attrs: { level: 1 } })
                .run()
            }
          />
          <Dropdown.Item
            icon="heading"
            text="Heading 2"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertContent({ type: "heading", attrs: { level: 2 } })
                .run()
            }
          />
          <Dropdown.Item
            icon="heading"
            text="Heading 3"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertContent({ type: "heading", attrs: { level: 3 } })
                .run()
            }
          />
          <Dropdown.Item
            icon="table"
            text="Table"
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertTable({
                  rows: 2,
                  cols: 3,
                  withHeaderRow: false,
                })
                .run();
            }}
          />
          <Dropdown.Item
            onClick={async () => {
              const file = await selectOneFile({ accept: "image/*" });
              if (!file) return;
              const url = URL.createObjectURL(file);
              const optimalSize = await getOptimalSize(url);
              editor
                .chain()
                .focus()
                .insertImage({
                  src: url,
                  alt: "",
                  width: optimalSize.width,
                  height: optimalSize.height,
                })
                .run();
            }}
          >
            <Icon name="photo" />
            Image
          </Dropdown.Item>
          <Dropdown.Item
            icon="video"
            text="Video"
            onClick={() => {
              editor.chain().focus().insertContent({ type: "video" }).run();
            }}
          />
        </Dropdown.Menu>
      </Dropdown>
    </TiptapReact.FloatingMenu>
  );
}
