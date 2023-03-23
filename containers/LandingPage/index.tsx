import FooterPanel from "../PageHome/containers/FooterPanel";

import KoloursTypo from "./components/KoloursTypo";
import LogoKreateWhite from "./components/LogoKreateWhite";
import NftCollection from "./containers/NftCollection";
import RemindBar from "./containers/RemindBar";
import { useLandingPageColor } from "./hooks/useLandingPageColor";
import background from "./image/background.png";
import styles from "./index.module.scss";

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
          <div
            className={styles.backgroundContainer}
            style={{ backgroundImage: `url(${background.src}` }}
          >
            <div className={styles.backgroundContent}>
              <LogoKreateWhite />
              <Divider.Vertical color="white-10" />
              <KoloursTypo />
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
