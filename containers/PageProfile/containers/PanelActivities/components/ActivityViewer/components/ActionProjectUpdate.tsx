import * as React from "react";

import {
  Address,
  formatScope,
  ProjectActivityAction,
} from "@/modules/business-types";
import Flex from "@/modules/teiki-ui/components/Flex";
import InlineAddress from "@/modules/teiki-ui/components/InlineAddress";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Extract<ProjectActivityAction, { type: "project_update" }>;
  createdBy: Address;
};

export default function ActionProjectUpdate({
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
        <Typography.Span content=" updated " />
        <Typography.Span
          content={value.scope.map(formatScope).join(", ")}
          fontWeight="semibold"
          color="ink"
        />
      </Typography.Div>
      {value.message ? (
        <Typography.Div
          style={{
            paddingLeft: "10px",
            borderLeft: "2px solid rgba(0, 110, 70, 0.3)",
          }}
          content={value.message}
          color="ink80"
          size="bodySmall"
          maxLines={2}
        ></Typography.Div>
      ) : null}
    </Flex.Col>
  );
}
