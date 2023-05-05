import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import InputSearch from "../../../../components/InputSearch";
import { NEXT_PUBLIC_ENABLE_LEGACY } from "../../../../config/client";
import useDetailedProject, {
  ProjectNotFound,
} from "../../../PageProjectDetails/hooks/useDetailedProject";

import ButtonWalletNavbar from "./containers/ButtonWalletNavbar";
import ModalConnectWallet from "./containers/ButtonWalletNavbar/containers/ModalConnectWallet";
import ModalMigrateFromLegacy from "./containers/ButtonWalletNavbar/containers/ModalMigrateFromLegacy";
import IconLeaf from "./icons/IconLeaf";
import IconPlusSquare from "./icons/IconPlusSquare";
import styles from "./index.module.scss";

import { DisplayableError } from "@/modules/displayable-error";
import { NETWORK } from "@/modules/env/client";
import { useModalPromises } from "@/modules/modal-promises";
import { httpGetLegacyBacking } from "@/modules/next-backend-client/api/httpGetLegacyBacking";
import { httpGetProject } from "@/modules/next-backend-client/api/httpGetProject";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import { LogoKreateFull } from "@/modules/teiki-logos";
import Button from "@/modules/teiki-ui/components/Button";
import Typography from "@/modules/teiki-ui/components/Typography";
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
  const { showMessage } = useToast();

  const paymentPubKeyHash =
    appContextValue.walletStatus.status === "connected"
      ? appContextValue.walletStatus.info.addressDetails.paymentCredential
          ?.hash || null
      : null;
  const ownerAddress =
    appContextValue.walletStatus.status === "connected"
      ? appContextValue.walletStatus.info.address
      : undefined;

  const { project, error } = useDetailedProject(
    ownerAddress ? { active: true, ownerAddress, preset: "basic" } : undefined
  );

  const customUrl = project?.basics?.customUrl;

  const [isCreateProjectButtonDisabled, setIsCreateProjectButtonDisabled] =
    React.useState(false);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.alert}>
        <div className={styles.alertContent}>
          <p>
            {
              "Friendly reminder: We are sunsetting our ADA-based staking protocol."
            }
          </p>
          <p>
            <span>{"Please withdraw any funds and close "}</span>
            <span>{"your Projects before June 6. "}</span>
            <span>{"Feel free to contact us via "}</span>
            <a
              href="https://twitter.com/KreatePlatform"
              target="_blank"
              rel="noreferrer"
            >
              {"Twitter"}
            </a>
            <span>{" or "}</span>
            <a
              href="https://discord.gg/kreate"
              target="_blank"
              rel="noreferrer"
            >
              {"Discord"}
            </a>
            <span>{" for any assistance."}</span>
          </p>
          <p>
            <span>
              {"We’re very thankful for all the feedback and contributions we "}
            </span>
            <span>
              {"received from early supporters. We hope to see you around on "}
            </span>
            <a
              href="https://kreate.community/"
              target="_blank"
              rel="noreferrer"
            >
              {"our new Creator-centric platform"}
            </a>
            <span>{". ✨"}</span>
          </p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <div style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
            <LogoKreateFull network={NETWORK} />
          </div>
          <InputSearch className={styles.searchBar} />
          <ButtonWalletNavbar />
          {
            customUrl ? (
              <Button.Outline
                icon={<IconLeaf />}
                content="Your Page"
                size="medium"
                className={styles.button}
                onClick={() => {
                  router.push(`/k/${customUrl}`);
                }}
              />
            ) : null
            // (
            //   <Button.Outline
            //     icon={<IconPlusSquare />}
            //     content="Become a Kreator"
            //     size="medium"
            //     className={styles.button}
            //     disabled={
            //       appContextValue.walletStatus.status === "connecting" ||
            //       appContextValue.walletStatus.status === "unknown" ||
            //       (appContextValue.walletStatus.status === "connected" &&
            //         // 1. either still loading
            //         ((error == null && project == null) ||
            //           // 2. or loaded but there is error except ProjectNotFound
            //           (error != null && !(error instanceof ProjectNotFound)))) ||
            //       isCreateProjectButtonDisabled
            //     }
            //     onClick={async () => {
            //       try {
            //         if (appContextValue.walletStatus.status === "connected") {
            //           router.push(`/drafts/${paymentPubKeyHash}/edit`);
            //         } else {
            //           const modalResult = await showModal<WalletStatus>(
            //             (resolve) => {
            //               return (
            //                 <ModalConnectWallet
            //                   open
            //                   onCancel={() => resolve({ status: "disconnected" })}
            //                   onSuccess={(walletStatus) => resolve(walletStatus)}
            //                 />
            //               );
            //             }
            //           );
            //           if (modalResult.status !== "connected") return;

            //           if (NEXT_PUBLIC_ENABLE_LEGACY === "true") {
            //             try {
            //               const httpGetLegacyBacking$Response =
            //                 await httpGetLegacyBacking({
            //                   backerAddress: modalResult.info.address,
            //                 });
            //               if (
            //                 httpGetLegacyBacking$Response.error === undefined &&
            //                 httpGetLegacyBacking$Response.backingInfo.length > 0
            //               ) {
            //                 await showModal<void>((resolve) => (
            //                   <ModalMigrateFromLegacy
            //                     open
            //                     onClose={() => resolve()}
            //                   />
            //                 ));
            //               }
            //             } catch (error) {
            //               // we intentionally ignore errors
            //               console.error(error);
            //             }
            //           }

            //           setIsCreateProjectButtonDisabled(true);
            //           const ownerAddress = modalResult.info.address;
            //           if (!ownerAddress) return;
            //           const projectResponse = await httpGetProject({
            //             ownerAddress,
            //             preset: "minimal",
            //           });
            //           if (projectResponse.error != null) {
            //             router.push(
            //               `/drafts/${modalResult.info.addressDetails.paymentCredential?.hash}/edit`
            //             );
            //           }
            //           setIsCreateProjectButtonDisabled(false);
            //         }
            //       } catch (error) {
            //         const displayableError = DisplayableError.from(
            //           error,
            //           "Failed to become a Kreator"
            //         );
            //         showMessage({
            //           title: displayableError.title,
            //           description: displayableError.description,
            //           color: "danger",
            //         });
            //       }
            //     }}
            //   />
            // )
          }
        </div>
      </div>
    </div>
  );
}
