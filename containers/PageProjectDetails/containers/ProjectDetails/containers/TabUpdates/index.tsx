import cx from "classnames";
import * as React from "react";

import CommunityUpdateDetails from "./components/CommunityUpdateDetails";
import CommunityUpdateOverview from "./components/CommunityUpdateOverview";
import styles from "./index.module.scss";

import { AnyProjectPost } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: AnyProjectPost[];
};

export default function TabUpdates({ className, style, value }: Props) {
  const [openedArticleIndex, setOpenedArticleIndex] = React.useState<
    number | null
  >(null);
  return (
    <div className={cx(styles.container, className)} style={style}>
      {openedArticleIndex != null ? (
        <CommunityUpdateDetails
          key={openedArticleIndex}
          value={value[openedArticleIndex]}
          onClickBack={() => setOpenedArticleIndex(null)}
          onClickPrevious={
            openedArticleIndex > 0
              ? () => setOpenedArticleIndex(openedArticleIndex - 1)
              : undefined
          }
          onClickNext={
            openedArticleIndex + 1 < value.length
              ? () => setOpenedArticleIndex(openedArticleIndex + 1)
              : undefined
          }
        />
      ) : (
        value.map((item, index) => (
          <CommunityUpdateOverview
            // NOTE: sk-kitsune: Using index as a fallback value is for
            // extra robustness only. In reality, item.id should always
            // be defined.
            key={item.id || index}
            value={item}
            onClickLearnMore={() => setOpenedArticleIndex(index)}
          />
        ))
      )}
    </div>
  );
}
