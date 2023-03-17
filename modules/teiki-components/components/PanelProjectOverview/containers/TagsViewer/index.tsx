import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";

import { ProjectBasics } from "@/modules/business-types";
import Chip from "@/modules/teiki-ui/components/Chip";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBasics["tags"]; // string[]
};

export default function TagsViewer({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        <Typography.Div
          size="bodyExtraSmall"
          fontWeight="semibold"
          color="ink80"
          content="Tags: "
        />
        <Flex.Row flexWrap="wrap" gap="12px 8px">
          {!value.length ? (
            <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>{"-"}</span>
          ) : (
            value.map((tag, index) => (
              <>
                <Link
                  style={{ display: "flex", color: "unset" }}
                  key={index}
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
              </>
            ))
          )}
        </Flex.Row>
      </Flex.Row>
    </div>
  );
}
