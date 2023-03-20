import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";
import ImpactfulNumber from "../../components/ImpactfulNumber";

import styles from "./index.module.scss";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { formatUsdAmount } from "@/modules/bigint-utils";
import { ProjectGeneralInfo } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo["stats"] & ProjectGeneralInfo["history"];
};

const FREQUENCY_CONFIG = [
  {
    duration: 7 * 24 * 60 * 60 * 1000,
    label: "Always",
  },
  {
    duration: 2 * 7 * 24 * 60 * 60 * 1000, // two weeks
    label: "Frequent",
  },
  {
    duration: 30 * 24 * 60 * 60 * 1000, // a month
    label: "Often",
  },
  {
    duration: 90 * 24 * 60 * 60 * 1000, // a quarter
    label: "Sometime",
  },
  {
    duration: (365 * 24 * 60 * 60 * 1000) / 2, // half a year
    label: "Rarely",
  },
  {
    duration: Number.MAX_VALUE,
    label: "Never",
  },
];

export default function OtherStatsViewer({ className, style, value }: Props) {
  const adaPriceInfo = useAdaPriceInfo();
  const frequency =
    value.updatedAt == null ||
    value.createdAt == null ||
    value.averageMillisecondsBetweenProjectUpdates == null
      ? undefined
      : Number(value.updatedAt) === Number(value.createdAt)
      ? FREQUENCY_CONFIG[FREQUENCY_CONFIG.length - 1]
      : FREQUENCY_CONFIG.find(
          (item) =>
            Number(value.averageMillisecondsBetweenProjectUpdates) <=
            item.duration
        );

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col gap="24px">
        <ImpactfulNumber
          label="Number of members"
          content={
            value.numSupporters != null
              ? value.numSupporters.toLocaleString("en-US")
              : "-"
          }
          title={value.numSupporters?.toString()}
        />
        <ImpactfulNumber
          label="Update frequency"
          content={frequency ? frequency.label : "-"}
        />
        {value.numLovelacesStaked != null ? (
          <ImpactfulNumber
            label="Monthly income"
            content={
              adaPriceInfo != null
                ? formatUsdAmount(
                    {
                      lovelaceAmount:
                        /** NOTE: @sk-tenba:
                         * monthly income = numLovelacesStaked / 100 * 3.5 / 12
                         */
                        (BigInt(value.numLovelacesStaked) * BigInt(35)) /
                        BigInt(12000),
                      adaPriceInUsd: adaPriceInfo.usd,
                    }, //
                    {
                      includeCurrencySymbol: true,
                      includeAlmostEqualToSymbol: true,
                    }
                  )
                : "-"
            }
            title={
              (
                (BigInt(value.numLovelacesStaked) * BigInt(35)) /
                BigInt(12000)
              ).toString() + " lovelaces"
            }
          />
        ) : null}
      </Flex.Col>
    </div>
  );
}
