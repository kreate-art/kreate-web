import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import {
  useAllProjects,
  UseAllProjects$Params,
} from "../../hooks/useAllProjects";

import ProjectListItem from "./components/ProjectListItem";
import styles from "./index.module.scss";

/**
 * TODO: @sk-umiuma
 * For the 16/1 launch, only search by a single tag
 */
type Props = {
  page: number;
  params: UseAllProjects$Params;
  onLoad?: (hasMore: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function ProjectList({
  className,
  style,
  page,
  params,
  onLoad,
}: Props) {
  const router = useRouter();
  const { error, data } = useAllProjects({
    ...params,
    limit: 5,
    offset: page * 5,
  });

  /** FIXME: @sk-umiuma: Render should be a pure function
   * `onLoad` notices parent component whether
   * there is more projects to load
   */
  if (typeof data?.hasMore === "boolean") {
    onLoad && onLoad(data.hasMore);
  }

  return (
    <div className={cx(styles.container, className)} style={style}>
      {error ? (
        "error"
      ) : !data ? (
        "loading"
      ) : data.projects.length > 0 ? (
        <div className={styles.content}>
          {data.projects.map((project) => (
            <React.Fragment key={project.id}>
              <ProjectListItem
                value={project}
                key={project.id}
                borderless
                onClick={() =>
                  project.history.closedAt ||
                  project.history.delistedAt ||
                  !project.basics.customUrl
                    ? router.push(`/creator-by-id/${project.id}`)
                    : router.push(`/c/${project.basics.customUrl}`)
                }
              />
              <hr className={styles.divider} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div>
          <span>No projects found.</span>
        </div>
      )}
    </div>
  );
}
