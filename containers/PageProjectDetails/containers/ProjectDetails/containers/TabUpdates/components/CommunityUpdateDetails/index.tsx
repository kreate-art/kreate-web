import cx from "classnames";
import moment from "moment";
import * as React from "react";

import IconArrowLeftCircle from "../../icons/IconArrowLeftCircle";
import IconArrowRightCircle from "../../icons/IconArrowRightCircle";

import styles from "./index.module.scss";

import { AnyProjectPost } from "@/modules/business-types";
import RichTextEditor from "@/modules/teiki-components/components/RichTextEditor";
import Button from "@/modules/teiki-ui/components/Button";
import Chip from "@/modules/teiki-ui/components/Chip";
import Divider from "@/modules/teiki-ui/components/Divider";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: AnyProjectPost;
  onClickBack?: () => void;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
};

export default function CommunityUpdateDetails({
  className,
  style,
  value,
  onClickBack,
  onClickPrevious,
  onClickNext,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.beforeTitles}>
          <Button.Outline
            icon={<IconArrowLeftCircle />}
            content="All Posts"
            onClick={onClickBack}
          />
        </div>
        <div className={styles.titles}>
          <div className={styles.titlesMain}>
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
              content={value.title}
              maxLines={2}
            />
          </div>
          <div className={styles.titlesRight}>
            {value.createdAt ? (
              <Chip
                content={moment(value.createdAt).fromNow()}
                title={`${moment(value.createdAt).format()}\n${
                  value.createdAt
                }`}
              ></Chip>
            ) : null}
          </div>
        </div>
        <div className={styles.afterTitles}> </div>
      </div>
      <Divider.Horizontal />
      <div className={styles.main}>
        {/* TODO: @sk-kitsune: we should use a proper id */}
        {!value.exclusive && (
          <RichTextEditor
            key={value.createdAt}
            value={value.body}
            isBorderless
          />
        )}
      </div>
      <Divider.Horizontal />
      <div className={styles.footer}>
        <Button.Outline
          icon={<IconArrowLeftCircle />}
          content="Previous"
          onClick={onClickPrevious}
          disabled={!onClickPrevious}
        />
        <Button.Outline
          icon={<IconArrowRightCircle />}
          iconPosition="right"
          content="Next"
          onClick={onClickNext}
          disabled={!onClickNext}
        />
      </div>
    </div>
  );
}
