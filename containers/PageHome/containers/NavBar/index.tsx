import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";

import InputSearch from "../../../../components/InputSearch";
import {
  NEXT_PUBLIC_ENABLE_LEGACY,
  NEXT_PUBLIC_NETWORK,
} from "../../../../config/client";

import ButtonWalletNavbar from "./containers/ButtonWalletNavbar";
import ModalConnectWallet from "./containers/ButtonWalletNavbar/containers/ModalConnectWallet";
import ModalMigrateFromLegacy from "./containers/ButtonWalletNavbar/containers/ModalMigrateFromLegacy";
import IconLeaf from "./icons/IconLeaf";
import IconPlusSquare from "./icons/IconPlusSquare";
import styles from "./index.module.scss";

import { toJson } from "@/modules/json-utils";
import { useModalPromises } from "@/modules/modal-promises";
import { GetDetailedProject$Params } from "@/modules/next-backend/logic/getDetailedProject";
import { httpGetLegacyBacking } from "@/modules/next-backend-client/api/httpGetLegacyBacking";
import {
  httpGetProject,
  httpGetProject$GetKey,
} from "@/modules/next-backend-client/api/httpGetProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { LogoTeikiFull } from "@/modules/teiki-logos";
import Button from "@/modules/teiki-ui/components/Button";
import { WalletStatus } from "@/modules/wallet/types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders a NavBar which displays the following items:
 * - Teiki logo: clicking redirects to home page
 * - Search bar: allows user to search
 * - Buttons: Following, Sponsors, Connect Wallet, Create Project
 */
export default function NavBar({ className, style }: Props) {
  const appContextValue = useAppContextValue$Consumer();
  const router = useRouter();

  const { showModal } = useModalPromises();

  const paymentPubKeyHash =
    appContextValue.walletStatus.status === "connected"
      ? appContextValue.walletStatus.info.addressDetails.paymentCredential
          ?.hash || null
      : null;
  const ownerAddress =
    appContextValue.walletStatus.status === "connected"
      ? appContextValue.walletStatus.info.address
      : undefined;

  const httpGetProject$Params: GetDetailedProject$Params | undefined =
    ownerAddress ? { ownerAddress, active: true, preset: "basic" } : undefined;
  const httpGetProject$Key = httpGetProject$GetKey(httpGetProject$Params);
  const { data, error } = useSWR(httpGetProject$Key, () =>
    httpGetProject$Params ? httpGetProject(httpGetProject$Params) : undefined
  );

  const customUrl =
    !error && data?.error === undefined
      ? data?.project?.basics?.customUrl
      : null;

  const [isCreateProjectButtonDisabled, setIsCreateProjectButtonDisabled] =
    React.useState(false);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.main}>
        <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <LogoTeikiFull
            color="black-with-green-initial"
            network={NEXT_PUBLIC_NETWORK}
          />
        </div>
        <InputSearch className={styles.searchBar} />
        <ButtonWalletNavbar />
        {customUrl ? (
          <Button.Outline
            // TODO: define onClick
            icon={<IconLeaf />}
            content="Your Project"
            size="medium"
            onClick={() => {
              router.push(`/projects/${customUrl}`);
            }}
          />
        ) : (
          <Button.Outline
            // TODO: define onClick
            icon={<IconPlusSquare />}
            content="Create Project"
            size="medium"
            disabled={
              appContextValue.walletStatus.status === "connecting" ||
              appContextValue.walletStatus.status === "unknown" ||
              (appContextValue.walletStatus.status === "connected" &&
                (data == null || error != null)) ||
              isCreateProjectButtonDisabled
            }
            onClick={async () => {
              try {
                if (appContextValue.walletStatus.status === "connected") {
                  window.open(`/drafts/${paymentPubKeyHash}/edit`);
                } else {
                  const modalResult = await showModal<WalletStatus>(
                    (resolve) => {
                      return (
                        <ModalConnectWallet
                          open
                          onCancel={() => resolve({ status: "disconnected" })}
                          onSuccess={(walletStatus) => resolve(walletStatus)}
                        />
                      );
                    }
                  );
                  if (modalResult.status !== "connected") return;

                  if (NEXT_PUBLIC_ENABLE_LEGACY === "true") {
                    try {
                      const httpGetLegacyBacking$Response =
                        await httpGetLegacyBacking({
                          backerAddress: modalResult.info.address,
                        });
                      if (
                        httpGetLegacyBacking$Response.error === undefined &&
                        httpGetLegacyBacking$Response.backingInfo.length > 0
                      ) {
                        await showModal<void>((resolve) => (
                          <ModalMigrateFromLegacy
                            open
                            onClose={() => resolve()}
                          />
                        ));
                      }
                    } catch (error) {
                      // we intentionally ignore errors
                      console.error(error);
                    }
                  }

                  setIsCreateProjectButtonDisabled(true);
                  const ownerAddress = modalResult.info.address;
                  if (!ownerAddress) return;
                  const projectResponse = await httpGetProject({
                    ownerAddress,
                    preset: "minimal",
                  });
                  if (projectResponse.error != null) {
                    window.open(
                      `/drafts/${modalResult.info.addressDetails.paymentCredential?.hash}/edit`
                    );
                  }
                  setIsCreateProjectButtonDisabled(false);
                }
              } catch (error) {
                console.error(error);
                alert(error instanceof Error ? error.message : toJson(error));
                // TODO: @sk-tenba: show error dialog properly
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
