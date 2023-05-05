import cx from "classnames";
import * as React from "react";

import Podcast from "../Podcast";

import FooterPanel from "./containers/FooterPanel";
import NavBar from "./containers/NavBar";
import PanelProtocolStatistics from "./containers/PanelProtocolStatistics";
import ProjectCarousel from "./containers/ProjectCarousel";
import ProjectList from "./containers/ProjectList";
import SectionSlogan from "./containers/SectionSlogan";
import SponsorSlogan from "./containers/SponsorSlogan";
import { useAllProjects } from "./hooks/useAllProjects";
import { useProtocolStatistics } from "./hooks/useProtocolStatistics";
import { useTopSupporter } from "./hooks/useTopSupporter";
import IconLoadMore from "./icons/IconLoadMore";
import styles from "./index.module.scss";

import TableTopBackers from "@/modules/teiki-components/components/TableTopBackers";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageHome({ className, style }: Props) {
  React.useEffect(() => {
    console.log("This is PageHome");
  });

  useDefaultBackground();
  const { walletStatus, lastSavedWalletInfo } = useAppContextValue$Consumer();
  const [activeFilterIndex, setActiveFilterIndex] = React.useState(0);
  const featuredProjectsResponse = useAllProjects({
    category: "featured",
    active: true,
    relevantAddress:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : lastSavedWalletInfo
        ? lastSavedWalletInfo.address
        : undefined,
  });
  const sponsoredProjectsResponse = useAllProjects({
    category: "sponsor",
    active: true,
    relevantAddress:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : lastSavedWalletInfo
        ? lastSavedWalletInfo.address
        : undefined,
  });
  const protocolStatisticsResponse = useProtocolStatistics();
  const topSupporterResponse = useTopSupporter();
  const [numDisplayedPages, setNumDisplayedPages] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const projectLists = [];
  for (let i = 0; i < numDisplayedPages; i++) {
    projectLists.push(
      <ProjectList
        key={i}
        page={i}
        params={{
          active: true,
          category:
            activeFilterIndex === 2 && walletStatus.status === "connected"
              ? "relevant"
              : undefined,
          relevantAddress:
            walletStatus.status === "connected"
              ? walletStatus.info.address
              : lastSavedWalletInfo
              ? lastSavedWalletInfo.address
              : undefined,
        }}
        onLoad={(hasMore: boolean) => {
          if (!hasMore) setHasMore(false);
        }}
      />
    );
  }
  return (
    <>
      <TeikiHead />
      <div className={cx(styles.container, className)} style={style}>
        <nav className={styles.nav}>
          <NavBar />
        </nav>
        <main className={styles.main}>
          <div className={styles.blockContainer}>
            <SectionSlogan className={styles.slogan} />
            <ProjectCarousel
              className={styles.projectCarousel}
              error={featuredProjectsResponse.error}
              data={featuredProjectsResponse.data}
              descriptionMaxLines={3}
            />
          </div>
          <div className={styles.twoColumnsWrapper}>
            <div className={styles.twoColumns}>
              <div className={styles.columnLeft}>
                <div className={styles.sortButtonGroup}>
                  <Button.Outline
                    className={
                      activeFilterIndex === 0 ? styles.buttonActive : undefined
                    }
                    onClick={() => {
                      setActiveFilterIndex(0);
                      setNumDisplayedPages(1);
                    }}
                    content="Top"
                  />
                  {/* <Button
                    disabled={true}
                    variant={activeFilterIndex === 1 ? "solid" : "outline"}
                    onClick={() => {
                      setActiveFilterIndex(1);
                      setNumDisplayedPages(1);
                    }}
                    content="Trending"
                  /> */}
                  <Button.Outline
                    className={
                      activeFilterIndex === 2 ? styles.buttonActive : undefined
                    }
                    disabled={walletStatus.status !== "connected"}
                    onClick={() => {
                      setActiveFilterIndex(2);
                      setNumDisplayedPages(1);
                    }}
                    content="Recommended"
                  />
                </div>
                <Divider$Horizontal$CustomDash
                  style={{ marginBottom: "48px" }}
                />
                <div className={styles.projectContainer}>{projectLists}</div>
                {!hasMore ? null : (
                  <div className={styles.containerButtonLoadMore}>
                    <Button.Outline
                      icon={<IconLoadMore />}
                      content="More Kreators"
                      size="medium"
                      className={styles.buttonLoadMore}
                      onClick={() => {
                        setNumDisplayedPages(numDisplayedPages + 1);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className={styles.columnRight}>
                {/* <PanelProtocolStatistics
                  error={protocolStatisticsResponse.error}
                  data={protocolStatisticsResponse.data}
                  style={{ marginBottom: "12px" }}
                /> */}
                {topSupporterResponse.error ? (
                  "error"
                ) : !topSupporterResponse.data ? (
                  "loading"
                ) : (
                  <div className={styles.topBackersContainer}>
                    <h6 className={styles.label}>Top Fans</h6>
                    <TableTopBackers
                      value={topSupporterResponse.data.supporters}
                      className={styles.tableTopBackers}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={cx(styles.blockContainer, styles.sectionSlogan)}>
            <SponsorSlogan className={styles.slogan} />
            <ProjectCarousel
              className={styles.projectCarousel}
              maxItemWidth={500}
              error={sponsoredProjectsResponse.error}
              data={sponsoredProjectsResponse.data}
              padding="narrow"
              descriptionMaxLines={4}
            />
          </div>
        </main>
        <FooterPanel style={{ width: "100%" }} />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
