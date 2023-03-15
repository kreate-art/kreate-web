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
  const nonSponsorshipUpdate = value.scope.filter(
    (item) => item.type !== "sponsorship"
  );
  const sponsorshipUpdate = value.scope.find(
    (item) => item.type === "sponsorship"
  );
  return (
    <Flex.Col className={className} style={style} gap="8px">
      <Typography.Div size="bodySmall" color="ink80">
        <Typography.Span fontWeight="semibold" color="ink">
          <InlineAddress value={createdBy} length="short" />
        </Typography.Span>
        {!nonSponsorshipUpdate.length ? null : (
          <>
            <Typography.Span content={" updated "} />
            <Typography.Span
              content={nonSponsorshipUpdate.map(formatScope).join(", ")}
              fontWeight="semibold"
              color="ink"
            />
          </>
        )}
        {!nonSponsorshipUpdate.length || !sponsorshipUpdate ? null : (
          <Typography.Span content={", and"} />
        )}
        {!sponsorshipUpdate ? null : (
          <>
            <Typography.Span content={" extended "} />
            <Typography.Span
              content={formatScope(sponsorshipUpdate)}
              fontWeight="semibold"
              color="ink"
            />
          </>
        )}
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
