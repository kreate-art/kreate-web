import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import cx from "classnames";
import React from "react";

import BubbleMenuOnImageSelection from "./components/BubbleMenuOnImageSelection";
import BubbleMenuOnTableSelection from "./components/BubbleMenuOnTableSelection";
import BubbleMenuOnTextSelection from "./components/BubbleMenuOnTextSelection";
import BubbleMenuOnVideoSelection from "./components/BubbleMenuOnVideoSelection";
import FixedMenu from "./components/FixedMenu";
import FloatingMenuOnNewLine from "./components/FloatingMenuOnNewLine";
import { editorExtensions } from "./config";
import styles from "./index.module.scss";
import { toLazyJSONContent } from "./utils/lazy-object";
type Props = {
  className?: string;
  editorContentClassName?: string;
  value: JSONContent;
  onChange?: (newValue: JSONContent) => void;
  isBorderless?: boolean;
};

export default function RichTextEditor({
  className,
  value,
  onChange,
  isBorderless,
}: Props) {
  const editable = !!onChange;

  const editor = useEditor({
    extensions: editorExtensions,
    editorProps: { attributes: { class: styles.editor } },
    content: value,
    onUpdate: ({ editor }) => {
      if (!onChange) return;
      const newValue = toLazyJSONContent(() => editor.getJSON());
      onChange(newValue);
    },
    editable,
  });

  // https://github.com/ueberdosis/tiptap/issues/2403
  React.useEffect(() => {
    if (!editor) return;
    editor.on("update", ({ editor }) => {
      if (!onChange) return;
      const newValue = toLazyJSONContent(() => editor.getJSON());
      onChange(newValue);
    });
    return () => {
      editor.off("update");
    };
  }, [editor, onChange]);

  // for debugging purpose only
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).editor = editor;

  return editor ? (
    <div
      className={cx(
        isBorderless ? styles.containerBorderless : styles.container,
        className
      )}
    >
      {editable && (
        <>
          {!isBorderless && <FixedMenu editor={editor} />}
          <BubbleMenuOnTableSelection editor={editor} />
          <BubbleMenuOnTextSelection editor={editor} />
          <BubbleMenuOnImageSelection editor={editor} />
          <BubbleMenuOnVideoSelection editor={editor} />
          <FloatingMenuOnNewLine editor={editor} />
        </>
      )}
      <EditorContent editor={editor} />
    </div>
  ) : null;
}
