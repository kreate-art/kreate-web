import Image from "next/image";

import { ProjectImage } from "../../../../../../modules/business-types";

import styles from "./index.module.scss";

import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  images: ProjectImage[];
  onClickSetBanner: (imageUrl: string) => void;
};

export default function TagImageSuggestions({
  images,
  onClickSetBanner,
}: Props) {
  return (
    <div className={styles.basicImageSuggestion}>
      <Title content="Suggested banners" />
      <div className={styles.basicImageSuggestionList}>
        {images.map((image, index) => (
          <button
            className={styles.buttonImage}
            onClick={() => onClickSetBanner(image.url)}
            key={index}
          >
            <Image
              width={160}
              height={84}
              className={styles.basicBottomImage}
              src={image.url}
              alt={image.url}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
