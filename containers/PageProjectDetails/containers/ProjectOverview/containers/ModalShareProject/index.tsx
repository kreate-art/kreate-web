import React from "react";

import TagSocialMediaWrapper from "../../components/TagSocialMediaWrapper";
import IconClose from "../../icons/IconClose";

import styles from "./index.module.scss";

import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  showModalShareProject: boolean;
  close: () => void;
};

export default function ModalShareProject({
  showModalShareProject,
  close,
}: Props) {
  const showMessage = useToast();
  const [projectLink, setProjectLink] = React.useState<string>("");
  React.useEffect(() => {
    setProjectLink(window.location.href);
  }, []);

  return (
    <Modal
      open={showModalShareProject}
      className={styles.modal}
      onClose={() => close()}
    >
      <Modal.Header>
        <div className={styles.header}>
          <Typography.Span color="ink" content="Share " />
          <button className={styles.close} onClick={close}>
            <IconClose />
          </button>
        </div>
      </Modal.Header>
      <Modal.Content className={styles.content}>
        <TagSocialMediaWrapper
          listSocialMedia={[
            "twitter",
            "telegram",
            "reddit",
            "linkedIn",
            "facebook",
          ]}
          projectLink={projectLink}
        />
        <div className={styles.contentLink}>
          <Typography.Div size="heading6" content={projectLink} maxLines={1} />
          <Button.Solid
            content="Copy Link"
            style={{ height: "38px", minWidth: "min-content" }}
            onClick={() => {
              navigator.clipboard.writeText(projectLink).then(() => {
                showMessage.showMessage({
                  color: "success",
                  title: "Copied to clipboard",
                });
              });
            }}
          />
        </div>
      </Modal.Content>
    </Modal>
  );
}
