import cx from "classnames";
import * as React from "react";

import Flex from "../../components/Flex";

import styles from "./index.module.scss";
import { formatToEntry } from "./utils";

import { ProjectCommunity } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectCommunity["socialChannels"];
};

export default function SocialChannelsViewer({
  className,
  style,
  value,
}: Props) {
  const entries = value.map((item) => formatToEntry(item));

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px">
        <Flex.Cell className={styles.label} flex="0 0 auto">
          {"Social: "}
        </Flex.Cell>
        <Flex.Row gap="16px" flexWrap="wrap">
          {!entries.length ? (
            <span style={{ lineHeight: "40px", color: "rgba(0, 0, 0, 0.6)" }}>
              {"-"}
            </span>
          ) : (
            entries.map(({ url, isSafe, icon: Icon, tooltip }, index) => (
              <a
                key={index}
                href={url}
                onClick={(event) => {
                  if (isSafe) return;
                  if (confirm("Are you sure to open this link?\n" + url))
                    return;
                  event.preventDefault();
                }}
                target="_blank"
                rel="noopener noreferrer"
                title={tooltip}
              >
                <Button.Solid
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    color: "rgba(0, 54, 44, 0.8)",
                  }}
                  as="div"
                  icon={<Icon width="24" height="24" />}
                  color="white"
                  size="small"
                  circular
                />
              </a>
            ))
          )}
        </Flex.Row>
      </Flex.Row>
    </div>
  );
}
