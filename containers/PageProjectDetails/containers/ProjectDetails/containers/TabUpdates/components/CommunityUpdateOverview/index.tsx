import cx from "classnames";
import moment from "moment";
import * as React from "react";

import IconWarning from "../../../../../../components/IconWarning";
import IconDocumentCircle from "../../icons/IconDocumentCircle";

import styles from "./index.module.scss";

import { ProjectAnnouncement } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Chip from "@/modules/teiki-ui/components/Chip";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectAnnouncement;
  onClickLearnMore?: () => void;
};

export default function CommunityUpdateOverview({
  className,
  style,
  value,
  onClickLearnMore,
}: Props) {
  const censorshipContents = value.censorship
    ? value.censorship
        .filter((value) => value !== "political")
        .map((value) =>
          value
            .replace("identityAttack", "identity attack")
            .replace("sexualExplicit", "sexual explicit")
        )
    : [];
  const [isCensored, setIsCensored] = React.useState<boolean>(
    censorshipContents.length > 0
  );
  return (
    <article className={cx(styles.container, className)} style={style}>
      {isCensored ? (
        <div className={styles.censoredItemContainer} style={style}>
          <IconWarning />
          <Title
            content="Content Warning!"
            size="h3"
            className={styles.censoredItemTitle}
          />
          {/**TODO: @sk-tenba: more accurate content description */}
          <Typography.Div className={styles.censoredItemDescription}>
            This announcement contains {censorshipContents.join(", ")} content
            which may be inappropriate for some audiences and children
          </Typography.Div>
          <Button.Outline
            className={styles.censoredItemButton}
            content="I understand and want to view the announcement"
            onClick={() => setIsCensored(false)}
          />
        </div>
      ) : null}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          {value.sequenceNumber != null ? (
            <Title
              size="h6"
              color="green100"
              content={`Community Update #${value.sequenceNumber}`}
            />
          ) : null}
          <Typography.Div
            className={styles.title}
            size="heading2"
            color="ink"
            maxLines={2}
            content={value.title}
          />
          <IconDocumentCircle className={styles.iconDocumentCircle} />
        </div>
        <div className={styles.headerRight}>
          {value.createdAt ? (
            <Chip
              content={moment(value.createdAt).fromNow()}
              title={`${moment(value.createdAt).format()}\n${value.createdAt}`}
            ></Chip>
          ) : null}
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.main}>
        <div className={styles.summary}>{value.summary}</div>
        <div className={styles.linkContainer}>
          <Button.Link content="Read more" onClick={onClickLearnMore} />
        </div>
      </div>
    </article>
  );
}
