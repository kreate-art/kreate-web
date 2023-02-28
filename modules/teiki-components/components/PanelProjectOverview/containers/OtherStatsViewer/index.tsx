import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";
import ImpactfulNumber from "../../components/ImpactfulNumber";

import IconPin from "./icons/IconPin";
import IconRevenue from "./icons/IconRevenue";
import IconSpeechBubble from "./icons/IconSpeechBubble";
import styles from "./index.module.scss";

import { formatLovelaceAmount } from "@/modules/bigint-utils";
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
    className: styles.always,
  },
  {
    duration: 2 * 7 * 24 * 60 * 60 * 1000, // two weeks
    label: "Frequent",
    className: styles.frequent,
  },
  {
    duration: 30 * 24 * 60 * 60 * 1000, // a month
    label: "Often",
    className: styles.often,
  },
  {
    duration: 90 * 24 * 60 * 60 * 1000, // a quarter
    label: "Sometime",
    className: styles.sometime,
  },
  {
    duration: (365 * 24 * 60 * 60 * 1000) / 2, // half a year
    label: "Rarely",
    className: styles.rarely,
  },
  {
    duration: Number.MAX_VALUE,
    label: "Never",
    className: styles.never,
  },
];

export default function OtherStatsViewer({ className, style, value }: Props) {
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
      <Flex.Col gap="32px">
        <ImpactfulNumber
          icon={<IconRevenue />}
          label="Active ADA stake"
          content={
            value.numLovelacesStaked != null
              ? formatLovelaceAmount(
                  value.numLovelacesStaked, //
                  { includeCurrencySymbol: true }
                )
              : "-"
          }
          title={value.numLovelacesStaked?.toString()}
        />
        <ImpactfulNumber
          icon={<IconPin />}
          label="Number of backers"
          content={
            value.numSupporters != null
              ? value.numSupporters.toLocaleString("en-US")
              : "-"
          }
          title={value.numSupporters?.toString()}
        />
        <ImpactfulNumber
          icon={<IconSpeechBubble />}
          label="Update frequency"
          content={frequency ? frequency.label : "-"}
          contentClassName={frequency ? frequency.className : undefined}
        />
      </Flex.Col>
    </div>
  );
}
