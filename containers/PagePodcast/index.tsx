import React from "react";

import Podcast from "../../containers/Podcast";
import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageHome/containers/NavBar";

import CardPodcast from "./containers/CardPodcast";
import { useAllPodcasts } from "./hooks/useAllPodcasts";
import podcastBackgroundSupported from "./images/podcast-background-supported.png";
import podcastBackgroundWeekly from "./images/podcast-background-weekly.png";
import styles from "./index.module.scss";

import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

export default function PagePodcast() {
  const { walletStatus } = useAppContextValue$Consumer();
  const relevantPodcastsResponse = useAllPodcasts({
    backedBy:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : undefined,
  });
  const topPodcastsResponse = useAllPodcasts({});

  return (
    <>
      <TeikiHead />
      <div className={styles.body}>
        <NavBar />
        <div className={styles.bodyContent}>
          <div className={styles.container}>
            <div className={styles.title}>PODCASTS</div>
            <div className={styles.podcastContainer}>
              {walletStatus.status === "connected" ? (
                <CardPodcast
                  title="Relevant Announcements"
                  data={relevantPodcastsResponse}
                  podcastBackground={podcastBackgroundSupported.src}
                />
              ) : null}
              <CardPodcast
                title="Top Announcements"
                data={topPodcastsResponse}
                podcastBackground={podcastBackgroundWeekly.src}
              />
            </div>
          </div>
        </div>
        <FooterPanel style={{ width: "100%" }} />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
