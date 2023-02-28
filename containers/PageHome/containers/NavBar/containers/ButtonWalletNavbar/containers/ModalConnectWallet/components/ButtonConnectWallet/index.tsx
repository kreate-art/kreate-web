import cx from "classnames";
import * as React from "react";

import { IconRecommend } from "./icons/IconRecommend";
import IconSpin from "./icons/IconSpin";
import styles from "./index.module.scss";

import { toJson } from "@/modules/json-utils";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { WalletName, WalletStatus } from "@/modules/wallet/types";

type Props = {
  name: WalletName;
  label: string;
  logo: React.ReactNode;
  isRecommended?: boolean;
  installationUrl: string;
  onStartLoading?: () => void;
  onStopLoading?: () => void;
  onSuccess?: (walletStatus: WalletStatus) => void;
  onFailure?: (reason: unknown) => void;
  disabled?: boolean;
};

export default function ButtonConnectWallet({
  name,
  label,
  logo,
  isRecommended,
  installationUrl,
  onSuccess,
  onFailure,
  onStartLoading,
  onStopLoading,
  disabled,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const appContextValue = useAppContextValue$Consumer();
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      onStartLoading && onStartLoading();
      const result = await appContextValue.connectWallet(name);
      onSuccess && onSuccess(result);
    } catch (error) {
      onFailure &&
        onFailure(error instanceof Error ? error.message : toJson(error));
    } finally {
      setIsLoading(false);
      onStopLoading && onStopLoading();
    }
  };
  return window.cardano?.[name] ? (
    <button
      disabled={disabled}
      className={cx(
        styles.buttonWallet,
        disabled ? styles.disabledButton : null
      )}
      onClick={handleConnectWallet}
    >
      <div className={styles.headingLogo}>
        <div className={styles.heading}>
          {label}
          {isLoading ? <IconSpin /> : null}
        </div>
        <div>{logo}</div>
      </div>
      {isRecommended && (
        <div className={styles.recommend}>
          <IconRecommend className={styles.iconRecommend} />
          <div className={styles.recommendText}>
            We recommend open-source wallets for security reasons.
          </div>
        </div>
      )}
    </button>
  ) : (
    <button
      disabled={disabled}
      className={cx(
        styles.buttonWallet,
        disabled ? styles.disabledButton : null
      )}
    >
      <a href={installationUrl} target="_blank" rel="noreferrer">
        <div className={styles.headingLogo}>
          <div className={cx(styles.heading, styles.headingDimmed)}>
            {label}
          </div>
          <div className={styles.grayScale}>{logo}</div>
        </div>
        {isRecommended && (
          <div className={styles.recommend}>
            <IconRecommend />
            <div className={styles.recommendText}>
              We recommend open-source wallets for security reasons.
            </div>
          </div>
        )}
      </a>
    </button>
  );
}
