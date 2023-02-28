import cx from "classnames";
import moment from "moment";
import Link from "next/link";
import React from "react";

import { NEXT_PUBLIC_TEIKI_CDN } from "../../../../../../config/client";
import ProjectImageCropped from "../../../../../PageHome/components/ProjectImageCropped";
import IconWarning from "../../../../../PageProjectDetails/components/IconWarning";

import IconDownload from "./icons/IconDownload";
import IconView from "./icons/IconView";
import styles from "./index.module.scss";

import { Podcast } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  isPlaying: boolean;
  value: Podcast;
  uncensored: boolean;
  onClickUncensor?: () => void;
  onClick?: () => void;
  onClickViewProject?: () => void;
};

export default function PodcastItem({
  className,
  style,
  isPlaying,
  value,
  uncensored,
  onClickUncensor,
  onClick,
  onClickViewProject,
}: Props) {
  const title = `${value.pbasics.title}: ${value.title} - ${moment(
    value.completedAt
  ).format("MMMM Do YYYY")}`;

  const censorshipContents = value.censorship
    ? value.censorship
        .filter((value) => value !== "political")
        .map((value) =>
          value
            .replace("identityAttack", "identity attack")
            .replace("sexualExplicit", "sexual explicit")
        )
    : [];

  return (
    <div
      className={cx(
        styles.container,
        className,
        isPlaying ? styles.playing : undefined
      )}
      style={style}
    >
      {!uncensored ? (
        <div className={styles.censoredItemContainer}>
          <div className={styles.leftContainer}>
            <IconWarning width="40" height="40" />
            {/**TODO: @sk-tenba: more accurate content description */}
            <Typography.Div
              className={styles.censoredItemDescription}
              size="bodySmall"
            >
              This podcast contains {censorshipContents.join(", ")} content
              which may be inappropriate for some audiences and children
            </Typography.Div>
          </div>
          <div className={styles.buttonContainer}>
            <Button.Outline
              content="I understand and want to view the podcast"
              onClick={onClickUncensor}
            />
          </div>
        </div>
      ) : null}
      <div className={styles.leftContainer}>
        <ProjectImageCropped
          value={value.pbasics.logoImage}
          style={{ borderRadius: "4px", width: "47px", height: "47px" }}
        />
        <Title
          className={styles.title}
          size="h5"
          maxLines="1"
          onClick={() => onClick && onClick()}
        >
          {title}
        </Title>
      </div>
      <Flex.Row gap="8px">
        <Button.Outline
          icon={<IconView />}
          content="View Project"
          size="medium"
          onClick={onClickViewProject}
        />
        <Link
          href={`${NEXT_PUBLIC_TEIKI_CDN}/podcasts/${value.cid}.wav`}
          target="_blank"
        >
          <Button.Outline
            icon={<IconDownload />}
            size="medium"
            content="Download"
          />
        </Link>
      </Flex.Row>
    </div>
  );
}
