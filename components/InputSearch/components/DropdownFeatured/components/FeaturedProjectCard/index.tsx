import ProjectImageCropped from "../../../../../../containers/PageHome/components/ProjectImageCropped";
import { ProjectBasics } from "../../../../../../modules/business-types";

import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  basics: ProjectBasics;
  onClick?: () => void;
};

export default function FeaturedProjectCard({ basics, onClick }: Props) {
  return (
    <button onClick={onClick} className={styles.container}>
      <ProjectImageCropped
        value={basics.coverImages[0]}
        style={{ borderRadius: "16px" }}
        fluid
      />
      <Title className={styles.title}>{basics.title}</Title>
    </button>
  );
}
