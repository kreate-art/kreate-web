import Image from "next/image";

import { ProjectImage } from "../../../../../../modules/business-types";
import commonStyles from "../../index.module.scss";

import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  images: ProjectImage[];
  onClickSelectLogo: (url: string) => void;
};

export default function TagLogoSuggestions({
  images,
  onClickSelectLogo,
}: Props) {
  return (
    <div className={styles.basicImageSuggestion}>
      <Title content="Suggested logos" />
      <div className={styles.basicImageSuggestionList}>
        {images.map((image, index) => {
          return (
            <div className={commonStyles.basicImageItemWrapper} key={index}>
              <button
                className={styles.suggestionButton}
                onClick={() => onClickSelectLogo(image.url)}
              >
                <Image
                  width={84}
                  height={84}
                  className={styles.basicBottomLogo}
                  src={image.url}
                  alt={image.url}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
