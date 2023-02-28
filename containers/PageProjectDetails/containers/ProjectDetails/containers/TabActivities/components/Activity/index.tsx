import cx from "classnames";
import moment from "moment";
import * as React from "react";

import IconWarning from "../../../../../../components/IconWarning";
import IconBullet from "../../icons/IconBullet";
import ActivityAction from "../ActivityAction";

import styles from "./index.module.scss";

import { ProjectActivity } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity;
};

export default function Activity({ className, style, value }: Props) {
  const censorshipContents =
    "message$ModeratedTags" in value.action &&
    value.action.message$ModeratedTags
      ? value.action.message$ModeratedTags
          .filter(
            (value) => value !== "political" && value !== "discrimination"
          )
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
    <div className={cx(styles.container, className)} style={style}>
      <IconBullet className={styles.bullet} />
      <div className={styles.activitiesContainer}>
        <div>
          <span className={styles.createdAt}>
            {value.createdAt
              ? moment(value.createdAt).format("DD MMM HH:mm")
              : null}
          </span>
          <ActivityAction className={styles.action} value={value.action} />
        </div>
        {!!value.action.message && (
          <div className={styles.messageContainer}>
            {isCensored ? (
              <div className={styles.censoredItemContainer}>
                <IconWarning width="20" height="20" />
                <Typography.Div size="bodyExtraSmall">
                  {" "}
                  This comment contains {censorshipContents.join(", ")} content
                </Typography.Div>
                <Button.Outline
                  size="small"
                  className={styles.censoredItemButton}
                  content="View comment"
                  onClick={() => setIsCensored(false)}
                />
              </div>
            ) : (
              <span className={styles.message} title={value.action.message}>
                {value.action.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
