import Link from "next/link";
import * as React from "react";

import { ProjectActivityAction } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";
import { getExplorerUrl } from "@/modules/urls";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Extract<ProjectActivityAction, { type: "unback" }>;
};

export default function ActionUnback({ className, style, value }: Props) {
  return (
    <Flex.Col className={className} style={style} gap="8px">
      <Typography.Div size="bodySmall" color="ink80">
        <Typography.Span fontWeight="semibold" color="ink">
          <InlineAddress value={value.createdBy} length="short" />
        </Typography.Span>
        <Typography.Span content=" unstaked " />
        <AssetViewer.Ada.Standard
          as="span"
          lovelaceAmount={value.lovelaceAmount}
          fontWeight="semibold"
          color="ink"
        />
        <span>{" ("}</span>
        <AssetViewer.Usd.FromAda
          as="span"
          lovelaceAmount={value.lovelaceAmount}
          fontWeight="semibold"
          color="ink"
        />
        <span>{")"}</span>
        <Link href={getExplorerUrl(value.createdTx)} target="_blank">
          <Typography.Span
            content="View transaction"
            size="heading6"
            style={{
              textDecoration: "underline",
              marginLeft: "8px",
            }}
            color="ink"
          />
        </Link>
      </Typography.Div>
      {value.message ? (
        <Typography.Div
          style={{
            paddingLeft: "10px",
            borderLeft: "2px solid rgba(34, 34, 34, 0.3)",
          }}
          content={value.message}
          color="ink80"
          size="bodySmall"
          maxLines={2}
        />
      ) : null}
    </Flex.Col>
  );
}
