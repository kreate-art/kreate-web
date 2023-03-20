import cx from "classnames";
import moment from "moment";
import * as React from "react";

import styles from "./index.module.scss";

import { ProjectHistory } from "@/modules/business-types";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectHistory;
  match?: number;
};

export default function HistoryViewerV2({
  className,
  style,
  value,
  match,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row flexWrap="wrap" gap="0 12px">
        <JoinWithSeparator separator={<div className={styles.divider} />}>
          {value.createdAt ? (
            <Typography.Div>
              <Typography.Span
                size="bodyExtraSmall"
                content="Created on: "
                fontWeight="semibold"
                color="ink80"
              />
              <Typography.Span
                size="bodyExtraSmall"
                content={moment(value.createdAt).format("ll")}
                title={moment(value.createdAt).format()}
                color="ink80"
              />
            </Typography.Div>
          ) : null}

          {value.updatedAt &&
          !value.closedAt &&
          value.createdAt &&
          Number(value.updatedAt) !== Number(value.createdAt) ? (
            <Typography.Div>
              <Typography.Span
                size="bodyExtraSmall"
                content="Last updated: "
                fontWeight="semibold"
                color="ink80"
              />
              <Typography.Span
                size="bodyExtraSmall"
                content={moment(value.updatedAt).fromNow()}
                title={moment(value.updatedAt).format()}
                color="ink80"
              />
            </Typography.Div>
          ) : null}

          {value.closedAt ? (
            <Typography.Div>
              <Typography.Span
                size="bodyExtraSmall"
                content="Closed: "
                fontWeight="semibold"
                color="ink80"
              />
              <Typography.Span
                size="bodyExtraSmall"
                content={moment(value.closedAt).fromNow()}
                title={moment(value.closedAt).format()}
                color="ink80"
              />
            </Typography.Div>
          ) : null}

          {match != null ? (
            <Typography.Div>
              <Typography.Span
                size="bodyExtraSmall"
                fontWeight="semibold"
                color="ink80"
                content={`${Math.round(match * 100)}% Match`}
              />
            </Typography.Div>
          ) : null}
        </JoinWithSeparator>
      </Flex.Row>
    </div>
  );
}

function JoinWithSeparator({
  separator,
  children,
}: {
  separator: React.ReactNode;
  children: React.ReactNode[];
}) {
  return (
    <>
      {children
        .filter((item) => !!item)
        .map((item, index) => (
          <React.Fragment key={index}>
            {index ? separator : null}
            {item}
          </React.Fragment>
        ))}
    </>
  );
}
