import cx from "classnames";
import moment from "moment";
import * as React from "react";

import IconWarning from "../../../../../../components/IconWarning";
import IconDocumentCircle from "../../icons/IconDocumentCircle";

import styles from "./index.module.scss";

import { sumLovelaceAmount } from "@/modules/bigint-utils";
import {
  AnyProjectPost,
  LovelaceAmount,
  ProjectBenefitsTier,
} from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Chip from "@/modules/teiki-ui/components/Chip";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: AnyProjectPost;
  totalStaked?: LovelaceAmount;
  tiers?: ProjectBenefitsTier[];
  onClickLearnMore?: () => void;
  onClickBecomeMember?: (initialAmount?: LovelaceAmount) => void;
};

export default function CommunityUpdateOverview({
  className,
  style,
  value,
  totalStaked,
  tiers,
  onClickLearnMore,
  onClickBecomeMember,
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
  const actualStakingAmount = totalStaked ?? 0;

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
      <Flex.Col gap="24px" className={styles.main}>
        <div className={styles.summary}>{value.summary}</div>
        {value.exclusive &&
        tiers &&
        value.exclusive.tier <= tiers.length &&
        actualStakingAmount < tiers[value.exclusive.tier - 1].requiredStake ? (
          <>
            <Divider.Horizontal />
            <Flex.Row
              justifyContent="space-between"
              padding="12px 20px 12px 20px"
              alignItems="center"
              className={styles.box}
            >
              <Typography.Div
                content={`Only member from Tier ${
                  value.exclusive.tier +
                  ": " +
                  tiers[value.exclusive.tier - 1].title
                } can view this post`}
                size="heading6"
                color="primary"
              />
              <Button.Solid
                content="Become a Member"
                color="primary"
                size="small"
                className={styles.member}
                onClick={() =>
                  onClickBecomeMember &&
                  onClickBecomeMember(
                    sumLovelaceAmount([
                      tiers[value.exclusive.tier - 1].requiredStake,
                      -actualStakingAmount,
                    ])
                  )
                }
              />
            </Flex.Row>
          </>
        ) : (
          <div className={styles.linkContainer}>
            <Button.Link content="Read more" onClick={onClickLearnMore} />
          </div>
        )}
      </Flex.Col>
    </article>
  );
}
