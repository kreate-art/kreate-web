import * as React from "react";

import { ProjectActivityAction } from "@/modules/business-types";
import { useTxParams$CreatorCreateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorCreateProject";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Extract<ProjectActivityAction, { type: "protocol_milestone_reached" }>;
};

export default function ActionProtocolMilestoneReached({
  className,
  style,
  value,
}: Props) {
  /**NOTE: @sk-tenba: write a proper hooks */
  const txParamsResult = useTxParams$CreatorCreateProject();
  return (
    <Flex.Col className={className} style={style} gap="8px">
      <Typography.Div size="bodySmall" color="ink80">
        <Typography.Span content="Project" fontWeight="semibold" color="ink" />
        <Typography.Span content=" reached " />
        <Typography.Span
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
