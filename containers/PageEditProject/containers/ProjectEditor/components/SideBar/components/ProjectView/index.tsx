import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../../../../../components/WithAspectRatio";
import ProjectImageCropped from "../../../../../../../PageHome/components/ProjectImageCropped";

import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectGeneralInfo;
};

export default function ProjectView({ className, style, value }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      Interesting. I found a relevant creator that could be a collaborator or
      competitor!
      <hr className={styles.divider} />
      <div
        className={styles.text}
        onClick={() => {
          window.open(
            value.history.closedAt ||
              value.history.delistedAt ||
              !value.basics.customUrl
              ? `/kreator-by-id/${value.id}`
              : `/k/${value.basics.customUrl}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
      >
        <WithAspectRatio aspectRatio={1 / 1} className={styles.logo}>
          <ProjectImageCropped value={value.basics.logoImage} fluid />
        </WithAspectRatio>
        <div>
          <Title size="h6" color="white" maxLines={1}>
            {value.basics.title}
          </Title>
          <Title
            style={{ fontWeight: 400, fontSize: "12px" }}
            color="white80"
            maxLines={3}
          >
            {value.basics.slogan}
          </Title>
        </div>
      </div>
    </div>
  );
}
