import { Divider } from "semantic-ui-react";

import ProjectCoverImages from "../../components/ProjectCoverImages";
import ProjectLogo from "../../components/ProjectLogo";

import styles from "./index.module.scss";

import { ProjectBasics, ProjectImage } from "@/modules/business-types";

type Props = {
  value: ProjectBasics;
  logoSuggestions: ProjectImage[];
  coverSuggestions: ProjectImage[];
  onChange?: (newValue: ProjectBasics) => void;
};

export default function BasicMedia({
  value,
  logoSuggestions,
  coverSuggestions,
  onChange,
}: Props) {
  return (
    <div className={styles.basicImages}>
      <ProjectLogo
        logo={value.logoImage}
        suggestions={logoSuggestions}
        onLogoChange={(newLogo) => {
          onChange && onChange({ ...value, logoImage: newLogo });
        }}
      />
      <Divider />
      <ProjectCoverImages
        images={value.coverImages}
        suggestions={coverSuggestions}
        onImagesChange={(newCoverImage) => {
          onChange && onChange({ ...value, coverImages: newCoverImage });
        }}
      />
    </div>
  );
}
