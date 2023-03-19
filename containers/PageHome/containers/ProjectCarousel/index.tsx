import cx from "classnames";
import * as React from "react";

import ProjectCard from "./components/ProjectCard";
import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";
import Carousel from "@/modules/teiki-components/components/Carousel";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  maxItemWidth?: number;
  error?: unknown;
  data?: {
    projects: ProjectGeneralInfo[];
  };
  padding?: "normal" | "narrow";
  descriptionMaxLines?: 1 | 2 | 3 | 4 | 5 | "none";
};

/**
 * Given a list of projects, renders them as a carousel.
 */
export default function ProjectCarousel({
  className,
  style,
  maxItemWidth,
  error,
  data,
  padding = "normal",
  descriptionMaxLines,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {error ? (
        "error"
      ) : !data ? (
        "loading"
      ) : (
        <Carousel gap="medium" maxItemWidth={maxItemWidth ?? 900}>
          {data.projects.slice(0, 2).map((project) => (
            <ProjectCard
              key={project.id}
              value={project}
              padding={padding}
              descriptionMaxLines={descriptionMaxLines}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
}
