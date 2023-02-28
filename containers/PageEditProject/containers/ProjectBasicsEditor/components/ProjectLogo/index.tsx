import ImageCropped from "../../../../../../components/ImageCropped";
import IconEdit from "../../icons/IconEdit";
import commonStyles from "../../index.module.scss";
import ModalEditLogo from "../ModalEditLogo";

import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import { useModalPromises } from "@/modules/modal-promises";
import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  logo: ProjectImage | null;
  suggestions: ProjectImage[];
  onLogoChange?: (newLogo: ProjectImage | null) => void;
};

export default function ProjectLogo({
  logo,
  suggestions,
  onLogoChange,
}: Props) {
  const { showModal } = useModalPromises();
  return (
    <div className={styles.basicLogo}>
      {logo ? (
        <>
          <div className={commonStyles.basicTitleWrapper}>
            <Title content="Logo" />
            <Button.Solid
              className={commonStyles.basicEditButton}
              icon={<IconEdit />}
              color="white"
              content="Edit"
              onClick={() =>
                showModal<void>((resolve) => {
                  return (
                    <ModalEditLogo
                      logo={logo}
                      suggestedImages={suggestions}
                      onChange={(newLogoImage) => {
                        onLogoChange && onLogoChange(newLogoImage);
                      }}
                      close={() => resolve()}
                    />
                  );
                })
              }
            />
          </div>
          <div className={styles.basicLogoImage}>
            <div className={styles.basicLogoImageItem}>
              <ImageCropped
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                }}
                src={logo.url}
                crop={{
                  x: logo.x,
                  y: logo.y,
                  w: logo.width,
                  h: logo.height,
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={commonStyles.basicTitleWrapper}>
            <Title content="Logo" />
          </div>
          <div className={styles.basicLogoImage}>
            <Button.Solid
              style={{ backgroundColor: "rgba(31, 62, 47, 0.2)" }}
              color="white"
              content="Edit"
              size="small"
              onClick={() =>
                showModal<void>((resolve) => {
                  return (
                    <ModalEditLogo
                      logo={logo}
                      suggestedImages={suggestions}
                      onChange={(newLogoImage) => {
                        onLogoChange && onLogoChange(newLogoImage);
                      }}
                      close={resolve}
                    />
                  );
                })
              }
            />
          </div>
        </>
      )}
      <div className={commonStyles.basicNote}>
        A square logo, preferably from 128x128 to 1024x1024 pixels.
      </div>
    </div>
  );
}
