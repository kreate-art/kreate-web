import moment from "moment";

import IconCompleted from "./components/IconCompleted";
import styles from "./index.module.scss";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { ProjectMilestone } from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

export default function TabMilestoneCard({
  dateIso,
  name,
  description,
  funding,
  isCompleted,
}: ProjectMilestone) {
  const adaPriceInfo = useAdaPriceInfo();
  return (
    <div className={styles.container}>
      <div className={styles.leftCardContainer}>
        <Title content={dateIso} />
        <IconCompleted className={styles.iconCompleted} />
        <div className={styles.statusContainer}>
          {!isCompleted ? (
            <Typography.Span
              size="bodyExtraSmall"
              color="ink"
              content="Upcoming"
              fontWeight="semibold"
            />
          ) : (
            <Typography.Span
              size="bodyExtraSmall"
              color="green"
              content="Completed"
              fontWeight="semibold"
            />
          )}
        </div>
      </div>
      <Divider.Vertical color="black-05" className={styles.divider} />
      <div className={styles.rightCardContainer}>
        <Title content={name} size="h3" fontWeight="semibold" />
        <Typography.Div
          className={styles.description}
          size="bodySmall"
          content={description}
        />
        {funding ? (
          <div className={styles.fundingWrapper}>
            <Typography.Span size="heading6" content="Funding: " />
            <Typography.Span
              size="heading6"
              color="green"
              content={formatLovelaceAmount(funding, {
                includeCurrencySymbol: true,
              })}
            />
            {adaPriceInfo ? (
              <Typography.Span
                color="ink"
                size="bodyExtraSmall"
                lineHeight="small"
                className={styles.adaPrice}
              >
                {formatUsdAmount(
                  {
                    lovelaceAmount: funding,
                    adaPriceInUsd: adaPriceInfo.usd,
                  },
                  {
                    includeAlmostEqualToSymbol: true,
                    includeCurrencySymbol: true,
                  }
                )}
              </Typography.Span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
