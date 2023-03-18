import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import cx from "classnames";

import { editorExtensions } from "../RichTextEditor/config";

import styles from "./index.module.scss";

import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";

type Props = {
  className?: string;
  editorContentClassName?: string;
  value: JSONContent;
};

export default function RichTextViewer({ className, value }: Props) {
  const [value$Debounced] = useDebounce(value, { delay: 500 });
  const editor = useEditor(
    {
      extensions: editorExtensions,
      editorProps: { attributes: { class: styles.editor } },
      content: value$Debounced,
      editable: false,
    },
    [value$Debounced]
  );

  // for debugging purpose only
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).editor = editor;

  return editor ? (
    <div className={cx(styles.container, className)}>
      <EditorContent editor={editor} />
    </div>
  ) : null;
}
