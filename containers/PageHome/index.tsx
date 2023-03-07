import cx from "classnames";
import * as React from "react";

import Podcast from "../Podcast";

import BlogSection from "./containers/BlogSection";
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

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import TableTopBackers from "@/modules/teiki-components/components/TableTopBackers";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageHome({ className, style }: Props) {
  useBodyClasses([styles.defaultBackground]);
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
                  <Button
                    variant={activeFilterIndex === 0 ? "solid" : "outline"}
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
                  <Button
                    disabled={walletStatus.status !== "connected"}
                    variant={activeFilterIndex === 2 ? "solid" : "outline"}
                    onClick={() => {
                      setActiveFilterIndex(2);
                      setNumDisplayedPages(1);
                    }}
                    content="Recommended"
                  />
                </div>

                <hr className={styles.divider} />
                <div className={styles.projectContainer}>{projectLists}</div>
                {!hasMore ? null : (
                  <div className={styles.containerButtonLoadMore}>
                    <Button
                      icon={<IconLoadMore />}
                      content="Load More Projects"
                      size="medium"
                      variant="outline"
                      className={styles.buttonLoadMore}
                      onClick={() => {
                        setNumDisplayedPages(numDisplayedPages + 1);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className={styles.columnRight}>
                <PanelProtocolStatistics
                  error={protocolStatisticsResponse.error}
                  data={protocolStatisticsResponse.data}
                  style={{ marginBottom: "12px" }}
                />
                {topSupporterResponse.error ? (
                  "error"
                ) : !topSupporterResponse.data ? (
                  "loading"
                ) : (
                  <div className={styles.topBackersContainer}>
                    <h6 className={styles.label}>Top Members</h6>
                    <TableTopBackers
                      value={topSupporterResponse.data.supporters}
                      className={styles.tableTopBackers}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.blockContainer}>
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
          <div className={styles.blockContainer}>
            <BlogSection className={styles.blogSection} />
          </div>
        </main>
        <FooterPanel style={{ width: "100%" }} />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
