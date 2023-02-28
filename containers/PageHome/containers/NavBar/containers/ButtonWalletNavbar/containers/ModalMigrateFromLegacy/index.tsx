import * as React from "react";

import LogoImageView from "./components/LogoImageView";
import styles from "./index.module.scss";
import { submitMigrateTx } from "./utils/submitMigrateTx";
import { submitUnbackTx } from "./utils/submitUnbackTx";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
import { useState$Async } from "@/modules/common-hooks/hooks/useState$Async";
import { assert } from "@/modules/common-utils";
import { toJson } from "@/modules/json-utils";
import { httpGetLegacyBacking } from "@/modules/next-backend-client/api/httpGetLegacyBacking";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Modal from "@/modules/teiki-ui/components/Modal";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  open: boolean;
  onClose?: () => void;
};

export default function ModalMigrateFromLegacy({ open, onClose }: Props) {
  const { walletStatus } = useAppContextValue$Consumer();
  const [migrationItems, setMigrationItems, migrationItems$Error] =
    useState$Async(async () => {
      if (walletStatus.status !== "connected") return undefined;
      const response = await httpGetLegacyBacking({
        backerAddress: walletStatus.info.address,
      });
      switch (response.error) {
        case undefined:
          return response.backingInfo;
        case 59:
          return [];
      }
    }, [
      walletStatus.status === "connected"
        ? walletStatus.info
        : walletStatus.status,
    ]);

  const [busy, setBusy] = React.useState(false);
  const [statusText, setStatusText] = React.useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      closeOnEscape={!busy}
    >
      <Modal.Header>
        <Flex.Row justifyContent="space-between" alignItems="center">
          <span>Backing Migration</span>
          <Button.Link
            content={
              !migrationItems || migrationItems?.length ? "Skip" : "Close"
            }
            disabled={busy}
            onClick={onClose}
          />
        </Flex.Row>
      </Modal.Header>
      <Modal.Content>
        {migrationItems$Error ? (
          <div>ERROR</div>
        ) : !migrationItems ? (
          <div>LOADING</div>
        ) : (
          <div>
            <MessageBox
              className={styles.messageBox}
              color="success"
              description="We have migrated the Teiki testnet protocol to fix bugs. Please migrate your tADA backing or withdraw them from the legacy protocol. Thank you!"
            />
            {!migrationItems.length ? (
              <MessageBox
                color="info"
                description="You have migrated all tADA!"
              />
            ) : null}
            <Flex.Col gap="16px">
              {migrationItems.map((item, index) => (
                <Flex.Row key={index}>
                  <Flex.Row
                    justifyContent="flex-start"
                    alignItems="center"
                    flex="1 1 100px"
                    gap="16px"
                  >
                    <LogoImageView value={item.project.basics?.logoImage} />
                    <Title content={item.project.basics?.title} />
                  </Flex.Row>
                  <Flex.Row
                    justifyContent="center"
                    alignItems="center"
                    flex="0 0 100px"
                  >
                    <span>
                      {formatLovelaceAmount(item.backingAmount, {
                        compact: true,
                        includeCurrencySymbol: true,
                      })}
                    </span>
                  </Flex.Row>
                  <Flex.Row
                    gap="12px"
                    justifyContent="flex-end"
                    alignItems="center"
                    flex="0 0 260px"
                  >
                    <Button.Outline
                      content="Unback"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          assert(walletStatus.status === "connected");

                          await submitUnbackTx({
                            lucid: walletStatus.lucid,
                            oldProjectId: item.project.id,
                            backedAmount: item.backingAmount,
                            backerAddress: walletStatus.info.address,
                            onProgress: (statusText) =>
                              setStatusText(statusText),
                          });

                          setMigrationItems(
                            migrationItems.filter(
                              (_, currentIndex) => currentIndex !== index
                            )
                          );
                        } catch (error) {
                          // @sk-kitsune: handle error properly
                          alert(
                            error instanceof Error
                              ? error.message
                              : toJson(error)
                          );
                          console.error(error);
                          setStatusText("Failed.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                    <Button.Outline
                      content="Migrate"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          assert(walletStatus.status === "connected");

                          await submitMigrateTx({
                            lucid: walletStatus.lucid,
                            oldProjectId: item.project.id,
                            newProjectId: item.newProjectId,
                            backedAmount: item.backingAmount,
                            backerAddress: walletStatus.info.address,
                            onProgress: (statusText) =>
                              setStatusText(statusText),
                          });

                          setMigrationItems(
                            migrationItems.filter(
                              (_, currentIndex) => currentIndex !== index
                            )
                          );
                        } catch (error) {
                          // @sk-kitsune: handle error properly
                          alert(
                            error instanceof Error
                              ? error.message
                              : toJson(error)
                          );
                          console.error(error);
                          setStatusText("Failed.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                  </Flex.Row>
                </Flex.Row>
              ))}
            </Flex.Col>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Title content={statusText || "\u00A0"} style={{ width: "100%" }} />
      </Modal.Actions>
    </Modal>
  );
}
