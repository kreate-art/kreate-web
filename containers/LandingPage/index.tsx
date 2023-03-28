import Image from "next/image";
import Link from "next/link";

import FooterPanel from "../PageHome/containers/FooterPanel";

import IconViewGallery from "./components/IconViewGallery";
import Guideline from "./containers/Guideline";
import KreataverseStory from "./containers/KreataverseStory";
import NavBar from "./containers/NavBar";
import LogoKreateWhite from "./containers/NavBar/components/LogoKreateWhite";
import NftCollection from "./containers/NftCollection";
import IconSwatches from "./containers/NftCollection/components/IconSwatches";
import RewardSection from "./containers/RewardsSection";
import RoadmapSection from "./containers/RoadmapSection";
import { useLandingPageColor } from "./hooks/useLandingPageColor";
import figureDiscount from "./images/figure-discount.png";
import styles from "./index.module.scss";

import { HOST } from "@/modules/env/client";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Divider from "@/modules/teiki-ui/components/Divider";
import Typography from "@/modules/teiki-ui/components/Typography";

export default function LandingPage() {
  useLandingPageColor();
  return (
    <>
      <TeikiHead
        title="Kolour the Metaverse with NFTs"
        description="Kreate Kolours brings a new trend to Web3, where users colour a Metaverse with NFTs. Let's paint a new world with Web3 creators and fans!"
        url="https://kolours.kreate.community"
        imageUrl={`${HOST}/images/meta-kolour.png?v=1`}
      />
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.background} />
          <div className={styles.backgroundContainer}>
            <NavBar />
            <div className={styles.backgroundMid}>
              <Image
                src={figureDiscount}
                alt="figure-discount"
                className={styles.figureDiscount}
              />
              <Link href="/mint" className={styles.kolourButtonContainer}>
                <div className={styles.kolourButton}>
                  <IconSwatches />
                  <Typography.Span
                    size="heading5"
                    content="Kolour the Kreataverse"
                  />
                </div>
              </Link>
              <Link
                href="/gallery"
                className={styles.viewGalleryButtonContainer}
              >
                <div className={styles.viewGalleryButton}>
                  <IconViewGallery />
                  <Typography.Span size="heading5" content="Gallery" />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.mainContent}>
            <NftCollection />
            <div className={styles.story}>Kreataverse Story</div>
            <KreataverseStory />
            <div className={styles.story}>
              Start
              <span
                style={{
                  color: "#EC5929",
                }}
              >
                {" "}
                Kolouring{" "}
              </span>
              THE KREATAVERSE
            </div>
            <Guideline />
            <RewardSection style={{ marginTop: "112px" }} />
            <RoadmapSection
              style={{ marginTop: "112px", marginBottom: "112px" }}
              id="roadmap"
            />
            <Link href="/mint" className={styles.kolourButtonContainer}>
              <div className={styles.kolourButton}>
                <IconSwatches />
                <Typography.Span
                  size="heading5"
                  content="Kolour the Kreataverse"
                />
              </div>
            </Link>
          </div>
        </div>
        <FooterPanel className={styles.footer} title="kolour" />
      </div>
    </>
  );
}
