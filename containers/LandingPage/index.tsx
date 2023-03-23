import Image from "next/image";
import Link from "next/link";

import WithAspectRatio from "../../components/WithAspectRatio";

import Footer from "./containers/Footer";
import RemindBar from "./containers/RemindBar";
import { useLandingPageColor } from "./hooks/useLandingPageColor";
import kolourNfts1 from "./image/kolour-nfts-1.png";
import kolourNfts2 from "./image/kolour-nfts-2.png";
import kolourNfts3 from "./image/kolour-nfts-3.png";
import styles from "./index.module.scss";

import ImageView from "@/modules/teiki-components/components/ImageView";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Typography from "@/modules/teiki-ui/components/Typography";

export default function LandingPage() {
  useLandingPageColor();
  return (
    <>
      <TeikiHead />
      <div className={styles.container}>
        <RemindBar />
        <div className={styles.main}>
          <div className={styles.mainContent}>
            <div style={{ color: "white" }}>
              Experience the first ever Web3 Kolouring & Kolour Royav
            </div>
            <div className={styles.upperNfts}>
              <div className={styles.nfts}>
                <WithAspectRatio aspectRatio={1 / 2}>
                  <ImageView
                    src={kolourNfts1.src}
                    crop={{ x: 0, y: 0, w: 1, h: 1 }}
                  />
                </WithAspectRatio>
              </div>
              <div className={styles.nfts}>
                <WithAspectRatio aspectRatio={1 / 2}>
                  <ImageView
                    src={kolourNfts2.src}
                    crop={{ x: 0, y: 0, w: 1, h: 1 }}
                  />
                </WithAspectRatio>
              </div>
              <div className={styles.nfts}>
                <WithAspectRatio aspectRatio={1 / 2}>
                  <ImageView
                    src={kolourNfts3.src}
                    crop={{ x: 0, y: 0, w: 1, h: 1 }}
                  />
                </WithAspectRatio>
              </div>
            </div>
            <div style={{ color: "white" }}>Kreataverse Story</div>
            <div style={{ color: "white" }}>
              Start Kolouring THE KREATAVERSE
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
