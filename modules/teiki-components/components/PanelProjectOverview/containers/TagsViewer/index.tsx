import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";

import { ProjectBasics } from "@/modules/business-types";
import Chip from "@/modules/teiki-ui/components/Chip";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBasics["tags"]; // string[]
};

export default function TagsViewer({ className, style, value }: Props) {
  const router = useRouter();

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        <Flex.Cell className={styles.label} flex="0 0 auto">
          {"Tags :"}
        </Flex.Cell>
        <Flex.Row flexWrap="wrap" gap="12px 8px">
          {!value.length ? (
            <span style={{ lineHeight: "28px", color: "rgba(0, 0, 0, 0.6)" }}>
              {"-"}
            </span>
          ) : (
            value.map((tag, index) => (
              <Chip
                key={index}
                content={tag}
                onClick={() => {
                  const search = new URLSearchParams({ tag });
                  router.push(`/search?${search.toString()}`);
                }}
                style={{ cursor: "pointer" }}
              />
            ))
          )}
        </Flex.Row>
      </Flex.Row>
    </div>
  );
}
