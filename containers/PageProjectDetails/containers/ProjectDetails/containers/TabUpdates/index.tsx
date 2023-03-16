import cx from "classnames";
import * as React from "react";

import CommunityUpdateDetails from "./components/CommunityUpdateDetails";
import CommunityUpdateOverview from "./components/CommunityUpdateOverview";
import styles from "./index.module.scss";

import { AnyProjectPost } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import { WalletAuthHeaderInfo } from "@/modules/wallet/hooks/useWalletAuthToken";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: AnyProjectPost[];
};

async function handleViewerSign(
  authenticateWallet: () => Promise<WalletAuthHeaderInfo>
) {
  await authenticateWallet();
}

export default function TabUpdates({ className, style, value }: Props) {
  const [openedArticleIndex, setOpenedArticleIndex] = React.useState<
    number | null
  >(null);
  const { walletStatus, walletAuthHeaderInfo, authenticateWallet } =
    useAppContextValue$Consumer();

  // This seems to cause reload when a connected wallet enter the creator page
  const isDisabledLogin =
    walletStatus.status === "disconnected" ||
    walletStatus.status === "unknown" ||
    walletStatus.status === "connecting";

  return (
    <div className={cx(styles.container, className)} style={style}>
      {walletAuthHeaderInfo.status !== "authenticated" && value.length ? (
        <Button.Outline
          // TODO: Handle this properly
          content={
            isDisabledLogin
              ? "Please connect to your wallet first"
              : "Login to view exclusive content"
          }
          onClick={() => handleViewerSign(authenticateWallet)}
          disabled={isDisabledLogin}
          style={{ width: "50%" }}
        />
      ) : null}
      {openedArticleIndex != null ? (
        <CommunityUpdateDetails
          key={openedArticleIndex}
          value={value[openedArticleIndex]}
          onClickBack={() => setOpenedArticleIndex(null)}
          onClickPrevious={
            openedArticleIndex > 0
              ? () => setOpenedArticleIndex(openedArticleIndex - 1)
              : undefined
          }
          onClickNext={
            openedArticleIndex + 1 < value.length
              ? () => setOpenedArticleIndex(openedArticleIndex + 1)
              : undefined
          }
        />
      ) : (
        value.map((item, index) => (
          <CommunityUpdateOverview
            // NOTE: sk-kitsune: Using index as a fallback value is for
            // extra robustness only. In reality, item.id should always
            // be defined.
            key={item.id || index}
            value={item}
            onClickLearnMore={() => setOpenedArticleIndex(index)}
          />
        ))
      )}
    </div>
  );
}
