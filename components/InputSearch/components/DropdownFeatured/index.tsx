import { ProjectGeneralInfo } from "../../../../modules/business-types";

import FeaturedProjectCard from "./components/FeaturedProjectCard";
import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  error?: unknown;
  data?: {
    projects: ProjectGeneralInfo[];
  };
  onClick?: (customUrl: string) => void;
};

export default function DropdownFeatured({ error, data, onClick }: Props) {
  return (
    <>
      <div className={styles.container}>
        <Title className={styles.title}>FEATURED PROJECTS</Title>
        <div className={styles.group}>
          {error
            ? "error"
            : !data
            ? "loading"
            : data.projects
                .slice(0, 4)
                .map((generalInfo: ProjectGeneralInfo) => (
                  <FeaturedProjectCard
                    key={generalInfo.id}
                    onClick={() =>
                      onClick && onClick(generalInfo.basics.customUrl)
                    }
                    basics={generalInfo.basics}
                  />
                ))}
        </div>
      </div>
    </>
  );
}
