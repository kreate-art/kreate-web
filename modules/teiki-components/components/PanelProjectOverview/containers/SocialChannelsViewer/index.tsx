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
  hideLabel?: boolean;
};

export default function SocialChannelsViewer({
  className,
  style,
  value,
  hideLabel,
}: Props) {
  const entries = value.map((item) => formatToEntry(item));

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row gap="12px" style={{ marginTop: "-4px", marginBottom: "-4px" }}>
        {hideLabel ? null : (
          <Flex.Cell className={styles.label} flex="0 0 auto">
            {"Social: "}
          </Flex.Cell>
        )}
        <Flex.Row gap="4px" flexWrap="wrap">
          {!entries.length ? (
            <span style={{ lineHeight: "40px", color: "rgba(0, 0, 0, 0.6)" }}>
              {"-"}
            </span>
          ) : (
            entries.map(({ url, isSafe, icon: Icon, tooltip }, index) => (
              <a
                key={index}
                // NOTE: @sk-kitsune: this hack is used because we don't have Button.Outline size="extraSmall" yet
                style={{ transform: "scale(0.8)" }}
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
                <Button.Outline
                  as="div"
                  icon={<Icon width="24" height="24" />}
                  color="green"
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
