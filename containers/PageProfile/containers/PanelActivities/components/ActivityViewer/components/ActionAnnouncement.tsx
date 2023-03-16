import * as React from "react";

import { Address, ProjectActivityAction } from "@/modules/business-types";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Extract<ProjectActivityAction, { type: "announcement" }>;
  createdBy: Address;
};

export default function ActionAnnouncement({
  className,
  style,
  value,
  createdBy,
}: Props) {
  return (
    <Flex.Col className={className} style={style} gap="8px">
      <Typography.Div size="bodySmall" color="ink80">
        <Typography.Span fontWeight="semibold" color="ink">
          <InlineAddress value={createdBy} length="short" />
        </Typography.Span>
        <Typography.Span content=" posted" />
      </Typography.Div>
      {value.title || value.message ? (
        <Typography.Div
          style={{
            paddingLeft: "10px",
            borderLeft: "2px solid rgba(34, 34, 34, 0.3)",
          }}
          color="ink80"
          size="bodySmall"
        >
          <Typography.Div
            content={value.title}
            fontWeight="semibold"
            size="none"
            color="none"
            maxLines={2}
          />
          <Typography.Div
            content={value.message}
            fontWeight="regular"
            size="none"
            color="none"
            maxLines={2}
          />
        </Typography.Div>
      ) : null}
    </Flex.Col>
  );
}
