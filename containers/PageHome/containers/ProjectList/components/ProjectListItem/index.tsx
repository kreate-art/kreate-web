import cx from "classnames";
import * as React from "react";

import { ProjectGeneralInfo } from "../../../../../../modules/business-types";
import CreationAndUpdateTime from "../../../../components/ProjectCreationAndUpdateTime";
import ProjectStats from "../../../../components/ProjectStats";
import ProjectSummary from "../../../../components/ProjectSummary";
import TagList from "../../../../components/ProjectTagList";
import ProjectThumbnail from "../../../../components/ProjectThumbnail";

import IconWarning from "./components/IconWarning";
import styles from "./index.module.scss";

import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo;
  borderless?: boolean;
  onClick?: () => void;
};

export default function ProjectListItem({
  className,
  style,
  value,
  borderless,
  onClick,
}: Props) {
  /**NOTE: @sk-tenba: temporarily remove 'political' because of model performance */
  const censorshipContents = value.censorship
    ? value.censorship
        .filter((value) => value !== "political")
        .map((value) =>
          value
            .replace("identityAttack", "identity attack")
            .replace("sexualExplicit", "sexual explicit")
        )
    : [];
  const [isCensored, setIsCensored] = React.useState(
    censorshipContents.length > 0
  );
  return (
    <div
      className={cx(
        styles.container,
        className,
        borderless ? null : styles.border
      )}
      style={style}
      onClick={() => !isCensored && onClick && onClick()}
    >
      {isCensored ? (
        <div className={styles.censoredItemContainer}>
          <IconWarning />
          <Title
            content="Content Warning!"
            size="h3"
            className={styles.censoredItemTitle}
          />
          {/**TODO: @sk-tenba: more accurate content description */}
          <Typography.Div className={styles.censoredItemDescription}>
            This kreator provides {censorshipContents.join(", ")} content which
            may be inappropriate for some audiences and children
          </Typography.Div>
          <Button.Outline
            className={styles.censoredItemButton}
            content="I understand and want to see"
            onClick={() => setIsCensored(false)}
          />
        </div>
      ) : null}
      <div className={styles.left}>
        <ProjectThumbnail
          coverImages={value.basics.coverImages}
          logoImage={value.basics.logoImage}
          match={value.match}
        />
      </div>
      <div className={styles.main}>
        <Title
          content={value.basics.title}
          size="h2"
          color="ink100"
          maxLines="2"
        />
        <Title
          content={value.basics.slogan}
          className={styles.slogan}
          size="h4"
          color="green100"
          maxLines="2"
        />
        <CreationAndUpdateTime
          className={styles.creationAndUpdateTime}
          createdAt={value.history.createdAt}
          updatedAt={value.history.updatedAt}
        />
        <TagList className={styles.tagList} value={value.basics.tags} />
        <ProjectSummary
          className={styles.summary}
          value={value.basics.summary}
        />
        <ProjectStats className={styles.stats} value={value.stats} />
      </div>
    </div>
  );
}
