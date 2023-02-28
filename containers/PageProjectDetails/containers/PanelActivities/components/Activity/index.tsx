import cx from "classnames";
import moment from "moment";
import * as React from "react";

import ActivityAction from "../../../ProjectDetails/containers/TabActivities/components/ActivityAction";
import IconBullet from "../../../ProjectDetails/containers/TabActivities/icons/IconBullet";

import styles from "./index.module.scss";

import { ProjectActivity } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectActivity;
};

export default function Activity({ className, style, value }: Props) {
  /* NOTE: Some tags from AI moderation are camel case so we
   * have to replace them with more user-friendly tags, also,
   * we temporarily remove 'political' because of model performance
   */
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
        {value.action.message ? (
          isCensored ? (
            <div className={styles.censoredMessageContainer}>
              <div className={styles.censoredMessage}>
                This comment may contains strong language which may be
                inappropriate to some audiences.
              </div>
              <button
                className={styles.censoredMessageButton}
                onClick={() => setIsCensored(false)}
              >
                View
              </button>
            </div>
          ) : (
            <div className={styles.messageContainer}>
              <span className={styles.message} title={value.action.message}>
                {value.action.message}
              </span>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
