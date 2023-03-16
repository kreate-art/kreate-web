import WithAspectRatio from "../../../../../../../../components/WithAspectRatio";
import ModalEditImage from "../../../../../ProjectBasicsEditor/components/ModalEditImage";
import IconImage from "../../icons/IconImage";

import styles from "./index.module.scss";

import { ProjectImage } from "@/modules/business-types";
import { useModalPromises } from "@/modules/modal-promises";
import ImageView from "@/modules/teiki-components/components/ImageView";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  banner?: ProjectImage;
  onBannerChange?: (banner?: ProjectImage) => void;
};

export default function TierBanner({ banner, onBannerChange }: Props) {
  const { showModal } = useModalPromises();

  function handleClick() {
    showModal<void>((resolve) => {
      return (
        <ModalEditImage
          images={banner ? [banner] : []}
          suggestedImages={[]}
          onChange={(banners) => {
            onBannerChange &&
              onBannerChange(banners.length ? banners[0] : undefined);
          }}
          close={resolve}
        />
      );
    });
  }

  return (
    <>
      <div className={styles.image}>
        {!banner ? (
          <>
            <div className={styles.image}>
              <Button.Link
                content={
                  <Flex.Col alignItems="center" gap="8px">
                    <IconImage />
                    <Typography.Div content="Tier Banner" size="bodySmall" />
                  </Flex.Col>
                }
                onClick={handleClick}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.banner} onClick={handleClick}>
              <WithAspectRatio aspectRatio={16 / 9}>
                <ImageView
                  className={styles.view}
                  src={banner.url}
                  crop={{
                    x: banner.x,
                    y: banner.y,
                    w: banner.width,
                    h: banner.height,
                  }}
                />
              </WithAspectRatio>
            </div>
          </>
        )}
      </div>
    </>
  );
}
