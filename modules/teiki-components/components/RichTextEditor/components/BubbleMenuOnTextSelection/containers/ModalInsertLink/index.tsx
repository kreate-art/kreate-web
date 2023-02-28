import { Editor } from "@tiptap/core";
import * as React from "react";

import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Input from "@/modules/teiki-ui/components/Input";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  open: boolean;
  className?: string;
  style?: React.CSSProperties;
  editor: Editor;
  onClose: () => void;
};

export default function ModalInsertLink({
  open,
  className,
  style,
  editor,
  onClose,
}: Props) {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setUrl(editor.getAttributes("link").href || "");
  }, [editor, open]);

  const handleSetLink = () => {
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      onClose();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
    onClose();
  };
  return (
    <Modal open={open} style={style} className={className} onClose={onClose}>
      <Modal.Content>
        <Title>Enter your url</Title>
        <Input
          className={styles.input}
          type="text"
          value={url}
          onChange={(value) => setUrl(value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSetLink();
            }
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button.Solid onClick={handleSetLink} size="small">
          OK
        </Button.Solid>
      </Modal.Actions>
    </Modal>
  );
}
