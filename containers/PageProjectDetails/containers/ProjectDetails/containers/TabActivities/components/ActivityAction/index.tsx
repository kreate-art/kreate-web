import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import styles from "./index.module.scss";

import { formatScope, ProjectActivityAction } from "@/modules/business-types";
import { getExplorerUrl } from "@/modules/common-utils";
import { useTxParams$CreatorCreateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCreateProject";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivityAction;
};

export default function ActivityAction({ className, style, value }: Props) {
  const txParamsResult = useTxParams$CreatorCreateProject();
  switch (value.type) {
    case "back":
      return (
        <Link href={getExplorerUrl(value.createdTx)} target="_blank">
          <Typography.Div
            maxLines={2}
            className={cx(className, styles.action)}
            style={style}
          >
            <Typography.Span size="heading6">
              <InlineAddress value={value.createdBy} length="short" />
            </Typography.Span>
            <Typography.Span
              color="ink80"
              size="bodySmall"
              lineHeight="medium"
              content=" staked "
            />
            <Typography.Span size="heading6" color="green">
              <AssetViewer.Ada.Standard
                as="span"
                lovelaceAmount={value.lovelaceAmount}
              />
            </Typography.Span>
          </Typography.Div>
        </Link>
      );

    case "unback":
      return (
        <Link href={getExplorerUrl(value.createdTx)} target="_blank">
          <Typography.Div
            maxLines={2}
            className={cx(className, styles.action)}
            style={style}
          >
            <Typography.Span size="heading6">
              <InlineAddress value={value.createdBy} length="short" />
            </Typography.Span>
            <Typography.Span
              color="ink80"
              size="bodySmall"
              lineHeight="medium"
              content=" unstaked "
            />
            <Typography.Span size="heading6">
              <AssetViewer.Ada.Standard
                as="span"
                lovelaceAmount={value.lovelaceAmount}
              />
            </Typography.Span>
          </Typography.Div>
        </Link>
      );

    case "announcement":
      return (
        <Typography.Div
          maxLines={2}
          className={cx(className)}
          style={style}
          title={`${value.projectTitle} posted: ${value.title}`}
        >
          <Typography.Span size="heading6" content={value.projectTitle} />
          <Typography.Span
            size="bodySmall"
            content=" posted: "
            lineHeight="medium"
            color="ink80"
          />
          <Typography.Span size="heading6" content={value.title} />
        </Typography.Div>
      );

    case "project_update": {
      const nonSponsorshipUpdate = value.scope.filter(
        (item) => item.type !== "sponsorship"
      );
      const sponsorshipUpdate = value.scope.find(
        (item) => item.type === "sponsorship"
      );
      return (
        <Typography.Div maxLines={2} className={className} style={style}>
          <Typography.Span size="heading6" content={value.projectTitle} />
          {!nonSponsorshipUpdate.length ? null : (
            <>
              <Typography.Span content={" updated "} size="bodySmall" />
              <Typography.Span
                content={nonSponsorshipUpdate.map(formatScope).join(", ")}
                fontWeight="semibold"
                size="heading6"
              />
            </>
          )}
          {!nonSponsorshipUpdate.length || !sponsorshipUpdate ? null : (
            <Typography.Span content={", and"} size="bodySmall" />
          )}
          {!sponsorshipUpdate ? null : (
            <>
              <Typography.Span content={" extended "} size="bodySmall" />
              <Typography.Span
                content={formatScope(sponsorshipUpdate)}
                fontWeight="semibold"
                size="heading6"
              />
            </>
          )}
        </Typography.Div>
      );
    }

    case "protocol_milestone_reached":
      return (
        <Typography.Div maxLines={2} className={className} style={style}>
          <Typography.Span size="heading6" content={value.projectTitle} />
          <Typography.Span
            size="bodySmall"
            lineHeight="medium"
            content=" reached "
            color="ink80"
          />
          <Typography.Span
            size="heading6"
            content={`Protocol Landmark ${value.milestonesSnapshot} (over ${
              txParamsResult != null && txParamsResult.error == null
                ? (
                    Number(
                      txParamsResult.computed.protocolParams.projectMilestones[
                        value.milestonesSnapshot - 1
                      ]
                    ) / 1000000
                  ).toLocaleString()
                : "-"
            } ADA raised)`}
          />
        </Typography.Div>
      );
    case "project_creation":
      return (
        <Typography.Div maxLines={2} className={className} style={style}>
          <Typography.Span size="heading6" content={value.projectTitle} />
          <Typography.Span
            size="bodySmall"
            lineHeight="medium"
            content=" launched"
            color="ink80"
          />
          {value.sponsorshipAmount ? (
            <>
              <Typography.Span
                size="bodySmall"
                lineHeight="medium"
                content={` with a Kreate sponsorship of `}
                color="ink80"
              />
              <Typography.Span size="heading6" color="green">
                <AssetViewer.Ada.Standard
                  as="span"
                  lovelaceAmount={value.sponsorshipAmount}
                />
              </Typography.Span>
              <Typography.Span
                size="bodySmall"
                lineHeight="medium"
                content={`/month`}
                color="ink80"
              />
            </>
          ) : null}
        </Typography.Div>
      );
  }
}
