import WithAspectRatio from "../../components/WithAspectRatio";
import FooterPanel from "../PageHome/containers/FooterPanel";

import KoloursTypo from "./components/KoloursTypo";
import LogoKreateWhite from "./components/LogoKreateWhite";
import NftCollection from "./containers/NftCollection";
import RemindBar from "./containers/RemindBar";
import { useLandingPageColor } from "./hooks/useLandingPageColor";
import background from "./image/background.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Divider from "@/modules/teiki-ui/components/Divider";

export default function LandingPage() {
  useLandingPageColor();
  return (
    <>
      <TeikiHead />
      <div className={styles.container}>
        <RemindBar />
        <div className={styles.main}>
          <div className={styles.backgroundContainer}>
            <WithAspectRatio aspectRatio={8 / 5}>
              <ImageView
                src={background.src}
                style={{ width: "100%", height: "100%" }}
                crop={{ x: 0, y: 0, w: 1, h: 1 }}
              />
            </WithAspectRatio>
            <div className={styles.backgroundContentContainer}>
              <div className={styles.backgroundContent}>
                <LogoKreateWhite />
                <Divider.Vertical color="white-10" />
                <KoloursTypo />
              </div>
            </div>
          </div>
          <div className={styles.mainContent}>
            <NftCollection />
          </div>
        </div>
        <FooterPanel />
      </div>
    </>
  );
}
