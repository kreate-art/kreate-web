import { useRouter } from "next/router";
import * as React from "react";
import { Button, Grid, Icon } from "semantic-ui-react";

import IconPodcastMenu from "./components/IconPodcastMenu";
import styles from "./index.module.scss";
import { formatUsdAmountWithCurrencySymbol } from "./utils";

import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";

type Props = {
  podcastClassName?: string;
};

export default function Podcast({ podcastClassName }: Props) {
  // FIXME: Revert this when the design is ready
  return null;

  const router = useRouter();
  const { adaPriceInfo } = useAppContextValue$Consumer();
  const adaPrice = adaPriceInfo?.usd || null;

  return (
    <>
      <div className={podcastClassName}>
        <section className={styles.podcastControl}>
          <Grid className={styles.podcastElements}>
            {/* <Grid.Column
              width={2}
              textAlign="center"
              verticalAlign="middle"
              className={styles.rightBorder}
            >
              <div className={styles.adaPrice}>
                <span className={styles.label} style={{ marginRight: "4px" }}>
                  1 ADA ≈
                </span>

                <span style={{ fontWeight: "bold" }}>
                  {adaPrice != null
                    ? formatUsdAmountWithCurrencySymbol(adaPrice)
                    : "-"}
                </span>
              </div>
            </Grid.Column>

            <Grid.Column
              width={10}
              textAlign="center"
              verticalAlign="middle"
              className={styles.rightBorder}
            >
              <div className={styles.playerControls}>
                <Button icon compact className={styles.podcastButtons}>
                  <Icon name="step backward"></Icon>
                </Button>

                <Button icon compact className={styles.podcastButtons}>
                  <Icon name="pause"></Icon>
                </Button>

                <Button icon compact className={styles.podcastButtons}>
                  <Icon name="step forward"></Icon>
                </Button>

                <div className={styles.progressBar}>
                  <div className={styles.progressLine}></div>
                </div>

                <div className={styles.podcastScript}>
                  <span className={styles.boldGreenText}>Teiki</span>
                  <span>Podcast</span>

                  <span className={styles.boldGreenText}>Nov 9, 2022</span>

                  <span>See our lastest winners and get inspired!</span>
                </div>
              </div>
            </Grid.Column>

            <Grid.Column
              width={2}
              textAlign="center"
              verticalAlign="middle"
              className={styles.rightBorder}
            >
              <div className={styles.allPodcasts}>
                <Icon name="arrow circle right" size="large" />
                <span style={{ fontWeight: "600" }}> View Project </span>
              </div>
            </Grid.Column> */}

            {/* Placeholder columns to align ADA price & Podcasts */}
            <Grid.Column width={12} />

            <Grid.Column
              width={2}
              textAlign="center"
              verticalAlign="middle"
              className={styles.leftBorder}
            >
              <div
                className={styles.allPodcasts}
                onClick={() => router.push(`/podcasts`)}
              >
                <IconPodcastMenu />
                <span>Podcasts</span>
              </div>
            </Grid.Column>
          </Grid>
        </section>
      </div>
    </>
  );
}
