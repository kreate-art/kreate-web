import cx from "classnames";
import Link from "next/link";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";

import { ProjectBasics } from "@/modules/business-types";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBasics["tags"]; // string[]
  hideLabel?: boolean;
};

export default function TagsViewer({
  className,
  style,
  value,
  hideLabel,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        {hideLabel ? null : (
          <Typography.Div
            size="bodyExtraSmall"
            fontWeight="semibold"
            color="ink80"
            content="Tags: "
            style={{ minWidth: "32px", flex: "0 0 auto" }}
          />
        )}
        <Flex.Row flexWrap="wrap" gap="12px 8px">
          {!value.length ? (
            <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>{"-"}</span>
          ) : (
            value.map((tag, index) => (
              <React.Fragment key={index}>
                <Link
                  style={{ display: "flex", color: "unset" }}
                  href={`/search?${new URLSearchParams({ tag })}`}
                >
                  <Typography.Span
                    content={"#" + tag}
                    size="bodyExtraSmall"
                    fontWeight="semibold"
                  />
                </Link>
                {index !== value.length - 1 && (
                  <span style={{ color: "rgba(34, 34, 34, 0.5)" }}>/</span>
                )}
              </React.Fragment>
            ))
          )}
        </Flex.Row>
      </Flex.Row>
    </div>
  );
}
