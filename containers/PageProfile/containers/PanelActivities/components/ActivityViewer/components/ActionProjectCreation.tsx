import * as React from "react";

import { ProjectActivityAction } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Extract<ProjectActivityAction, { type: "project_creation" }>;
};

export default function ActionProjectCreation({
  className,
  style,
  value,
}: Props) {
  return (
    <Flex.Col className={className} style={style} gap="8px">
      <Typography.Div size="bodySmall" color="ink80">
        <Typography.Span content="Project" fontWeight="semibold" color="ink" />
        <Typography.Span content=" launched" />
        {value.sponsorshipAmount ? (
          <>
            <Typography.Span
              size="bodySmall"
              lineHeight="medium"
              content={` with a Kreate sponsorship of `}
              color="ink80"
            />
            <Typography.Span size="heading6">
              <AssetViewer.Ada.Standard
                as="span"
                lovelaceAmount={value.sponsorshipAmount}
                fontWeight="semibold"
                color="ink"
              />
            </Typography.Span>
            <Typography.Span
              size="bodySmall"
              lineHeight="medium"
              content={` (`}
              color="ink80"
            />
            <AssetViewer.Usd.FromAda
              as="span"
              lovelaceAmount={value.sponsorshipAmount}
              fontWeight="semibold"
              color="ink"
            />
            <Typography.Span
              size="bodySmall"
              lineHeight="medium"
              content={`)`}
              color="ink80"
            />
            <Typography.Span
              size="bodySmall"
              lineHeight="medium"
              content={`/month`}
              color="ink80"
            />
          </>
        ) : null}
      </Typography.Div>
    </Flex.Col>
  );
}
