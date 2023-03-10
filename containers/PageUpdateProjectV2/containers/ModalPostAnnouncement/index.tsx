import { JSONContent } from "@tiptap/core";
import * as React from "react";

import { buildTx } from "../../utils/transaction";

import styles from "./index.module.scss";
import {
  clearProjectAnnouncement,
  loadProjectAnnouncement,
  saveProjectAnnouncement,
} from "./utils";

import { throw$, try$, tryUntil } from "@/modules/async-utils";
import { ProjectAnnouncement } from "@/modules/business-types";
import {
  formatAutoSaverStatus,
  useAutoSaver,
} from "@/modules/common-hooks/hooks/useAutoSaver";
import { useConfirmationOnWindowClose } from "@/modules/common-hooks/hooks/useConfirmationOnWindowClose";
import { useMemo$Async } from "@/modules/common-hooks/hooks/useMemo$Async";
import { useState$Async } from "@/modules/common-hooks/hooks/useState$Async";
import { assert } from "@/modules/common-utils";
import { DisplayableError } from "@/modules/displayable-error";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";
import { useTxParams$CreatorUpdateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorUpdateProject";
import { ipfsAdd$WithBufsAs$Blob } from "@/modules/next-backend-client/utils/ipfsAdd$WithBufsAs$Blob";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";
import IconSpin from "@/modules/teiki-components/icons/IconSpin";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";
import Modal from "@/modules/teiki-ui/components/Modal";
import TextArea from "@/modules/teiki-ui/components/TextArea";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";
import { WithBufsAs } from "@/modules/with-bufs-as";
import { Converters } from "@/modules/with-bufs-as-converters";
import CodecBlob from "@/modules/with-bufs-as-converters/codecs/CodecBlob";

type Props = {
  open: boolean;
  projectId: string;
  labelAction: string;
  onAction?: (value: ProjectAnnouncement) => void;
  onSkip?: () => void;
  onSuccess?: () => void;
  onExit?: () => void;
  hideSkipButton?: boolean;
  hideExitButton?: boolean;
  submitOnAction?: boolean;
};

export default function ModalPostAnnouncement({
  open,
  projectId,
  labelAction,
  onAction,
  onSkip,
  onSuccess,
  onExit,
  hideSkipButton,
  hideExitButton,
  submitOnAction,
}: Props) {
  const { walletStatus } = useAppContextValue$Consumer();
  const txParamsResult = useTxParams$CreatorUpdateProject({ projectId });
  const { showMessage } = useToast();

  const [value, setValue, error] = useState$Async(
    async () => await loadProjectAnnouncement(projectId, "auto-save"),
    [projectId]
  );

  const [lastSubmission$Result, _] = useMemo$Async(
    async () => {
      return await loadProjectAnnouncement(projectId, "last-submission");
    },
    { debouncedDelay: 0 },
    [projectId]
  );

  /**TODO: @sk-tenba: move this function to teiki module */
  const isBlankJsonContent = (value: JSONContent) => {
    return (
      value == null ||
      (value.type === "doc" &&
        (value.content == null ||
          value.content.length === 0 ||
          (value.content.length === 1 &&
            value.content[0].type === "paragraph" &&
            (value.content[0].content == null ||
              value.content[0].content.length === 0))))
    );
  };

  const [richTextEditorKey, setRichTextEditorKey] = React.useState(0);
  const [statusBarText, setStatusBarText] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const handleSaveOnSubmit = async () => {
    if (value == null) return;
    await saveProjectAnnouncement(projectId, value, "last-submission");
    await clearProjectAnnouncement(projectId, "auto-save");
  };

  const handleSubmit = async () => {
    if (!value) return; // Hacky?

    setBusy(true);
    try {
      assert(walletStatus.status === "connected", "wallet not connected");
      assert(txParamsResult && !txParamsResult.error, "tx params invalid");

      setStatusBarText("Uploading files to IPFS...");
      const announcementCid = await try$(
        async () => {
          const blobWBA: WithBufsAs<ProjectAnnouncement, Blob> =
            await Converters.fromProjectAnnouncement(CodecBlob)(value);
          const cid = await ipfsAdd$WithBufsAs$Blob(blobWBA);
          return cid;
        },
        (cause) => throw$(new Error("failed to upload files", { cause }))
      );

      const latestAnnouncementCid = await getLatestAnnouncementCid(projectId);

      DisplayableError.assert(latestAnnouncementCid !== announcementCid, {
        title: "Failed to post announcement",
        description: "You cannot repost the previous announcement",
      });

      setStatusBarText("Building transaction...");
      const buildTx$Params = {
        lucid: walletStatus.lucid,
        txParams: txParamsResult.data.txParams,
        newSponsorshipAmount: undefined,
        newInformationCid: undefined,
        newAnnouncementCid: announcementCid,
      };
      const { txComplete } = await buildTx(buildTx$Params).catch((cause) => {
        console.error({ buildTx$Params }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to build transaction");
      });

      setStatusBarText("Waiting for signature...");
      const txCompleteSigned = await txComplete
        .sign()
        .complete()
        .catch((cause) => {
          console.error({ txComplete }); // for debugging purpose
          throw DisplayableError.from(cause, "Failed to sign");
        });

      setStatusBarText("Waiting for submission...");
      const txHash = await txCompleteSigned.submit().catch((cause) => {
        console.error({ txCompleteSigned });
        throw DisplayableError.from(cause, "Failed to submit");
      });

      setStatusBarText("Waiting for confirmation...");
      await walletStatus.lucid.awaitTx(txHash).catch((cause) => {
        console.error({ txHash }); // for debugging purpose
        throw DisplayableError.from(cause, "Failed to wait for confirmation");
      });

      setStatusBarText("Waiting for indexers...");
      await waitUntilAnnouncementIndexed(projectId, announcementCid).catch(
        (cause) => {
          console.error({ projectId, announcementCid }); // for debugging purpose
          throw DisplayableError.from(cause, "Failed to wait for indexers");
        }
      );

      setStatusBarText("Done.");
      await handleSaveOnSubmit();
      onSuccess && onSuccess();
    } catch (error) {
      const displayableError = DisplayableError.from(
        error,
        "Failed to post announcement"
      );
      showMessage({
        title: displayableError.title,
        description: displayableError.description,
        color: "danger",
      });
      setStatusBarText("Failed.");
    } finally {
      setBusy(false);
    }
  };

  const autoSaveStatus = useAutoSaver({
    value,
    onSave: async (value, signal) => {
      if (!value) return;
      await saveProjectAnnouncement(projectId, value, "auto-save", signal);
    },
    onError: (error) => {
      console.error(error); // TODO: @sk-kitsune: we should display an alert to user
    },
    debouncedDelay: 1000,
    disabled: !!error || !value,
  });

  useConfirmationOnWindowClose(
    autoSaveStatus !== "idle" && autoSaveStatus !== "success"
  );

  if (error || value === undefined) return null;

  return (
    <Modal
      open={open}
      onClose={onExit}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
    >
      <Modal.Header content="New Post" />
      <Modal.Content>
        {error ? (
          <div>ERROR</div>
        ) : !value ? (
          <div>LOADING</div>
        ) : (
          <form
            className={styles.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset className={styles.fieldset}>
              <Title content="Title" />
              <Input
                value={value.title}
                onChange={(title) => setValue((value) => ({ ...value, title }))}
              />
            </fieldset>
            <fieldset className={styles.fieldset}>
              <Title content="Description" />
              {/**
               * TODO: @sk-tenba: Handle the issue of this editor.
               * The input for title and summary would be automatically reverted to the previous state
               * when we type in this editor
               */}
              <RichTextEditor
                key={richTextEditorKey}
                value={value.body}
                onChange={(body) => setValue((value) => ({ ...value, body }))}
              />
            </fieldset>
            <fieldset className={styles.fieldset}>
              <Title content="Summary" />
              <TextArea
                value={value.summary}
                onChange={(summary) =>
                  setValue((value) => ({ ...value, summary }))
                }
              />
            </fieldset>
          </form>
        )}
      </Modal.Content>
      <Modal.Actions>
        {busy ? (
          <Flex.Row
            className={styles.statusTextContainer}
            flex="1 1 50px"
            justifyContent="stretch"
            alignItems="center"
            gap="10px"
          >
            {busy ? <IconSpin /> : null}
            <Typography.Span size="heading6" content={statusBarText} />
          </Flex.Row>
        ) : (
          <Flex.Row
            flex="1 1 50px"
            justifyContent="stretch"
            alignItems="center"
            style={{ overflow: "hidden" }}
          >
            <Title size="h6" content={formatAutoSaverStatus(autoSaveStatus)} />
          </Flex.Row>
        )}
        {!hideExitButton ? (
          <Button.Outline //
            content="Exit"
            disabled={busy}
            onClick={() => onExit && onExit()}
          />
        ) : null}
        {lastSubmission$Result != null &&
        (lastSubmission$Result.title !== "" ||
          !isBlankJsonContent(lastSubmission$Result.body) ||
          lastSubmission$Result.title !== "") ? (
          <Button.Outline
            content="Load last submission"
            disabled={busy}
            onClick={() => {
              setValue(lastSubmission$Result);
              setRichTextEditorKey((value) => value + 1);
            }}
          />
        ) : null}
        {!hideSkipButton ? (
          <Button.Outline //
            content="Skip"
            disabled={busy}
            onClick={() => onSkip && onSkip()}
          />
        ) : null}
        <Button.Solid
          content={labelAction}
          disabled={busy}
          onClick={() => {
            if (onAction) {
              onAction(value);
            } else if (submitOnAction) {
              handleSubmit();
            }
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export async function waitUntilAnnouncementIndexed(
  projectId: string,
  announcementCid: string
) {
  await tryUntil({
    run: () => httpGetProject({ projectId, preset: "full" }),
    until: (response) =>
      response.error === undefined &&
      response.project.announcements != null &&
      response.project.announcements.some(
        (announcement) => announcement.announcementCid === announcementCid
      ),
  });
}

export async function getLatestAnnouncementCid(projectId: string) {
  const response = await httpGetProject({ projectId, preset: "full" });
  if (
    response.error !== undefined ||
    response.project.announcements == null ||
    response.project.announcements.length === 0
  ) {
    return null;
  }
  return response.project.announcements[0].announcementCid;
}
