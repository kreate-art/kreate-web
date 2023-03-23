import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { CSSProperties } from "react";

import styles from "./index.module.scss";

import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: CSSProperties;
  value: string[];
  inverted?: boolean;
};

export default function ProjectTagList({
  className,
  style,
  value,
  inverted,
}: Props) {
  const router = useRouter();

  return (
    <div
      className={cx(
        styles.container,
        className,
        inverted ? styles.inverted : null
      )}
      style={style}
    >
      <Typography.Span
        style={{ flex: "0 0 auto" }}
        color="ink80"
        content="Tags: "
        size="bodyExtraSmall"
        fontWeight="semibold"
      />
      <div className={styles.data}>
        {value.length ? (
          value.map((tag, index) => {
            const href = `/search?${new URLSearchParams({ tag })}`;

            return (
              <React.Fragment key={tag}>
                <Typography.Span
                  content={"#" + tag}
                  size="bodyExtraSmall"
                  fontWeight="semibold"
                  color="ink"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(href);
                  }}
                  // We are trying to repurpose a span as a link, so it's best to follow
                  // ARIA practices: https://www.w3.org/WAI/ARIA/apg/patterns/link/examples/link/
                  role="link"
                  aria-label={`Search projects contain ${tag} tag and navigate to search results page`}
                  tabIndex={0}
                  // Adding data-attribute MIGHT helps Google web crawler to recognize this is a link
                  // Although, this is just a speculation, so it's a long shot
                  // https://webmasters.stackexchange.com/questions/74475/does-googlebot-crawl-items-that-look-like-urls-in-html5-data-attributes
                  data-href={href}
                />
                {index !== value.length - 1 && (
                  <span style={{ color: "rgba(34, 34, 34, 0.5)" }}>/</span>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <span className={styles.noTags}>no tags</span>
        )}
      </div>
    </div>
  );
}
