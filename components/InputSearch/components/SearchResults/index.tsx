import { useRouter } from "next/router";

import styles from "./index.module.scss";

import { ProjectGeneralInfo } from "@/modules/business-types";

type Props = {
  error?: unknown;
  data?: { projects: ProjectGeneralInfo[] };
  onClick?: () => void;
};

export default function SearchResults({ error, data, onClick }: Props) {
  const router = useRouter();
  return (
    <>
      {error
        ? "error"
        : !data?.projects
        ? "suggesting..."
        : data.projects.slice(0, 4).map((project, index) => (
            <button
              key={index}
              className={styles.searchResult}
              onClick={() => {
                /**NOTE: @sk-tenba: the route will not change if the search project
                 * is the same as the project user is currently visiting
                 * */
                if (
                  (router.query.projectId == null ||
                    router.query.projectId !== project.id) &&
                  (router.query.projectCustomUrl == null ||
                    router.query.projectCustomUrl !== project.basics.customUrl)
                ) {
                  project.history.closedAt ||
                  project.history.delistedAt ||
                  !project.basics.customUrl
                    ? router.push(`/creator-by-id/${project.id}`)
                    : router.push(`/c/${project.basics.customUrl}`);
                }
                onClick && onClick();
              }}
            >
              {project.basics.title}
              <span className={styles.slogan}>
                {": " + project.basics.slogan}
              </span>
            </button>
          ))}
    </>
  );
}
