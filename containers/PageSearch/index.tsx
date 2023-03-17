import { useRouter } from "next/router";
import React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageHome/containers/NavBar";
import ProjectList from "../PageHome/containers/ProjectList";
import IconLoadMore from "../PageHome/icons/IconLoadMore";
import Podcast from "../Podcast";

import styles from "./index.module.scss";

import { range } from "@/modules/array-utils";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";

/**
 * Search results are fetched all at once and passed to this component
 * as the number of projects is small in the beginning phase. Will
 * have to change when there are a lot of results
 */
export default function PageSearch() {
  const router = useRouter();
  const { walletStatus, lastSavedWalletInfo } = useAppContextValue$Consumer();
  // TODO: @sk-umiuma:
  // For the 16/1 launch, use indefinite scrolling
  // const [activePageIndex, setActivePageIndex] = React.useState(0);
  const [activeFilterIndex, setActiveFilterIndex] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const searchValue = router.query["query"];
  const tagParams = router.query["tag"];
  // const [selectedTags, setSelectedTags] = React.useState<string[]>(
  //   tagParams ? [tagParams.toString()] : []
  // );
  // const searchResultReponse = useAllProjects({
  //   searchQuery: searchValue?.toString(),
  //   searchMethod: searchValue ? "fts" : undefined,
  //   tags: typeof tagParams === "string" ? [tagParams] : undefined,
  // });

  const [numDisplayedPages, setNumDisplayedPages] = React.useState(1);
  const projectLists = range(numDisplayedPages).map((i) => (
    <ProjectList
      key={i}
      page={i}
      params={{
        searchQuery: searchValue?.toString(),
        searchMethod: searchValue ? "fts" : undefined,
        tags: typeof tagParams === "string" ? [tagParams] : undefined,
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
        if (i === numDisplayedPages - 1) {
          setHasMore(hasMore);
        }
      }}
    />
  ));

  // const tagList = searchResultReponse.error
  //   ? []
  //   : Array.from(
  //       new Set(
  //         searchResultReponse.data?.projects.flatMap(
  //           (project) => project.basics.tags
  //         )
  //       )
  //     );

  // function filterByTags(
  //   projects: ProjectGeneralInfo[],
  //   tags: string[]
  // ): ProjectGeneralInfo[] {
  //   return !tags.length
  //     ? projects
  //     : projects.filter((project) =>
  //         project.basics.tags.some((tag) => tags.includes(tag))
  //       );
  // }

  return (
    <>
      <TeikiHead />
      <div className={styles.pageContainer}>
        <nav className={styles.nav}>
          <NavBar />
        </nav>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.leftPanel}>
                <div className={styles.topGroup}>
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
                </div>
                {/* <div className={styles.resultItems}>
                  {filterByTags(searchResultReponse.data.projects, selectedTags)
                    .slice(
                      activePageIndex * itemsPerPage,
                      (activePageIndex + 1) * itemsPerPage
                    )
                    .map((projectGeneralInfo) => (
                      <ProjectListItem
                        key={projectGeneralInfo.id}
                        style={{
                          paddingBottom: "48px",
                          borderBottom: "1px dashed rgba(0,0,0,0.1)",
                        }}
                        value={projectGeneralInfo}
                        borderless={true}
                        onClick={() =>
                          router.push(
                            `/k/${projectGeneralInfo.basics.customUrl}`
                          )
                        }
                      />
                    ))}
                </div> */}

                {/* <div className={styles.pageNavigation}>
                  {Array.from(
                    Array(
                      Math.floor(
                        (filterByTags(
                          searchResultReponse.data.projects,
                          selectedTags
                        ).length -
                          1) /
                          itemsPerPage
                      ) + 1
                    ).keys()
                  ).map((index) => (
                    <Button
                      key={index}
                      className={
                        activePageIndex == index
                          ? styles.navigationButtonActive
                          : styles.navigationButton
                      }
                      onClick={() => {
                        setActivePageIndex(index);
                      }}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div> */}
                <hr className={styles.divider} />
                <div className={styles.projectContainer}>{projectLists}</div>
                {!hasMore ? null : (
                  <div className={styles.containerButtonLoadMore}>
                    <Button
                      icon={<IconLoadMore />}
                      content="More Kreators"
                      size="medium"
                      variant="outline"
                      className={styles.buttonLoadMore}
                      onClick={() =>
                        setNumDisplayedPages(numDisplayedPages + 1)
                      }
                    />
                  </div>
                )}
              </div>
              {/* <div
                className={styles.rightPanel}
                // TODO: @sk-umiuma: disabled for the 16/1 launch
                style={{ display: "none" }}
              >
                <SelectBoard
                  tags={tagList}
                  selectedTags={selectedTags}
                  onChange={(changedTag: string) => {
                    if (selectedTags.includes(changedTag)) {
                      setSelectedTags(
                        selectedTags.filter((tag) => tag !== changedTag)
                      );
                    } else {
                      setSelectedTags([...selectedTags, changedTag]);
                    }
                  }}
                />
              </div> */}
            </div>
          </div>
        </main>
        <FooterPanel style={{ width: "100%" }} />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
