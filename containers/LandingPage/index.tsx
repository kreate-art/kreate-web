import WithAspectRatio from "../../components/WithAspectRatio";
import FooterPanel from "../PageHome/containers/FooterPanel";

import KoloursTypo from "./components/KoloursTypo";
import LogoKreateWhite from "./components/LogoKreateWhite";
// import Footer from "./containers/Footer";
import Guideline from "./containers/Guideline";
import KreataverseStory from "./containers/KreataverseStory";
import NftCollection from "./containers/NftCollection";
import IconSwatches from "./containers/NftCollection/components/IconSwatches";
import RemindBar from "./containers/RemindBar";
import RewardSection from "./containers/RewardsSection";
import { useLandingPageColor } from "./hooks/useLandingPageColor";
import background from "./image/background.png";
// import kolourNfts1 from "./image/kolour-nfts-1.png";
// import kolourNfts2 from "./image/kolour-nfts-2.png";
// import kolourNfts3 from "./image/kolour-nfts-3.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Divider from "@/modules/teiki-ui/components/Divider";
import Typography from "@/modules/teiki-ui/components/Typography";

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
          <div className={styles.story}>Kreataverse Story</div>
          <div className={styles.mainContent}>
            <KreataverseStory />
          </div>
          <div className={styles.story}>
            Start
            <span
              style={{
                color: "#EC5929",
                fontWeight: "700",
              }}
            >
              {" "}
              Kolouring{" "}
            </span>
            THE KREATAVERSE
          </div>
          <div className={styles.mainContent}>
            <Guideline />
          </div>
          <div className={styles.kolourButtonContainer}>
            <button className={styles.kolourButton}>
              <IconSwatches />
              <Typography.Span
                size="heading5"
                content="Scope the Kreataverse"
              />
            </button>
          </div>
        </div>
        <FooterPanel />
      </div>
    </>
  );
}
