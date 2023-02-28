import React from "react";
import { Button } from "semantic-ui-react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageHome/containers/NavBar";
import ProjectListItem from "../PageHome/containers/ProjectList/components/ProjectListItem";
import Podcast from "../Podcast";

import * as Api from "./hooks/api";
import styles from "./index.module.scss";

import TeikiHead from "@/modules/teiki-components/components/TeikiHead";

export default function PageSponsor() {
  const [activePageIndex, setActivePageIndex] = React.useState(0);
  /**
   * The number of sponsored projects is assumably small,
   * therefore we will fetch all it all at once
   */
  const sponsorProjectsResponse = Api.useSponsorProjects();
  const itemsPerPage = 5;
  return (
    <>
      <TeikiHead />
      <div className={styles.pageContainer}>
        <NavBar />
        {sponsorProjectsResponse.error ? (
          <div className={styles.message}>error</div>
        ) : !sponsorProjectsResponse.data ? (
          <div className={styles.message}>loading</div>
        ) : (
          <div className={styles.container}>
            <div className={styles.title}>SPONSORS</div>
            <div className={styles.resultContainer}>
              {sponsorProjectsResponse.data.projects
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
                  />
                ))}
            </div>
            <div className={styles.pageNavigation}>
              {Array.from(
                Array(
                  Math.floor(
                    (sponsorProjectsResponse.data.projects.length - 1) /
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
            </div>
          </div>
        )}
        <FooterPanel style={{ width: "100%" }} />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
