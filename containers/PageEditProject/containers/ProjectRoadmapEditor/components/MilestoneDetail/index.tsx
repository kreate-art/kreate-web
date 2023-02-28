import cx from "classnames";
import moment from "moment";

import IconCompleted from "./components/IconCompleted";
import styles from "./index.module.css";

import { useAdaPriceInfo } from "@/modules/ada-price-provider";
import { formatLovelaceAmount, formatUsdAmount } from "@/modules/bigint-utils";
import { ProjectMilestone } from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

export default function MilestoneDetail({
  date,
  name,
  description,
  funding,
  isCompleted,
}: ProjectMilestone) {
  const adaPriceInfo = useAdaPriceInfo();
  return (
    <div className={styles.milestoneMain}>
      <div className={styles.milestoneTime}>
        <Title content={moment(date).format("MMM DD, YYYY")} />
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
      <div className={styles.mileStoneInfo}>
        {name ? <Title content={name} size="h5" maxLines="2" /> : null}
        {/* TODO: @sk-umiuma: display tooltip */}
        {description ? (
          <Typography.Div
            size="bodySmall"
            className={styles.description}
            content={description}
          />
        ) : null}

        {funding ? (
          <div className={styles.funding}>
            <Typography.Span color="ink" size="heading6" content="Funding: " />
            <Typography.Span
              color="green"
              size="heading6"
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
        {!name && !description && !funding ? (
          <>
            <div className={styles.placeholderHeading} />
            <div className={cx(styles.placeholderLine, styles.description)} />
            <div className={cx(styles.placeholderLine, styles.description)} />
          </>
        ) : null}
      </div>
    </div>
  );
}
