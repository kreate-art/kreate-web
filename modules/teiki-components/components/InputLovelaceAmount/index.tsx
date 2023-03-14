import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import Input from "@/modules/teiki-ui/components/Input";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  // props for logic
  value: string;
  onChange: (value: string) => void;
  // props for displaying
  inlineError?: string;
  lovelaceAmount?: LovelaceAmount;
  maxLovelaceAmount?: LovelaceAmount;
  disabled?: boolean;
};

const AdaSymbol = "div"; // for readability only
const DescriptionGroup = "div"; // for readability only
const LeftDescription = "div"; // for readability only
const RightDescription = "div"; // for readability only

export default function InputSupportedLovelaceAmount({
  className,
  style,
  value,
  onChange,
  inlineError,
  lovelaceAmount,
  maxLovelaceAmount,
  disabled,
}: Props) {
  const { walletStatus, adaPriceInfo } = useAppContextValue$Consumer();
  const adaPriceInUsd = adaPriceInfo?.usd;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Input
        value={value}
        onChange={onChange}
        placeholder="Enter amount"
        color="green"
        disabled={disabled}
        error={!!inlineError && value !== ""}
        rightSlot={
          <>
            <AdaSymbol className={styles.adaSymbol}>₳</AdaSymbol>
            <Button.Link
              className={styles.buttonMax}
              content="Max"
              disabled={maxLovelaceAmount == null || disabled}
              onClick={() =>
                maxLovelaceAmount != null
                  ? onChange(
                      formatLovelaceAmount(maxLovelaceAmount, {
                        excludeThousandsSeparator: true,
                        useMaxPrecision: true,
                      })
                    )
                  : undefined
              }
            />
          </>
        }
      />
      <DescriptionGroup className={styles.descriptionGroup}>
        <LeftDescription>
          {!value ? (
            <span>&nbsp;</span>
          ) : inlineError ? (
            <span style={{ color: "#dc2020" }}>{inlineError}</span>
          ) : lovelaceAmount && adaPriceInUsd ? (
            <span>
              {formatUsdAmount(
                { lovelaceAmount, adaPriceInUsd },
                {
                  includeAlmostEqualToSymbol: true,
                  includeCurrencySymbol: true,
                }
              )}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </LeftDescription>
        <RightDescription>
          {walletStatus.status === "connected" ? (
            <span>
              <span>Your Balance: </span>
              <span style={{ fontWeight: "700" }}>
                {formatLovelaceAmount(
                  walletStatus.info.lovelaceAmount, //
                  { includeCurrencySymbol: true }
                )}
              </span>
            </span>
          ) : (
            <span>Wallet not connected</span>
          )}
        </RightDescription>
      </DescriptionGroup>
    </div>
  );
}
