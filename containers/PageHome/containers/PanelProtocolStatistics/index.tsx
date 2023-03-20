import cx from "classnames";
import * as React from "react";

import Card from "./components/Card";
import styles from "./index.module.scss";
import { shortenNumber } from "./utils";

import { ProtocolStatistics } from "@/modules/business-types";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  data?: { protocolStatistics: ProtocolStatistics };
  error?: unknown;
};

export default function PanelProtocolStatistics({
  className,
  style,
  error,
  data,
}: Props) {
  if (error) {
    // TODO: show a better UI
    return <div>error</div>;
  }

  if (!data) {
    // TODO: show a better UI
    return <div>loading</div>;
  }

  const stats = data.protocolStatistics;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <div className={styles.title}>Platform Statistics</div>
      <div className={styles.content}>
        <div className={styles.cardGroup}>
          <Card className={styles.card}>
            {stats.numProjects == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numProjects.toString()}>
                {stats.numProjects}
              </Card.Content>
            )}
            <Card.Legend>Creators</Card.Legend>
          </Card>
          <Divider.Horizontal color="black-10" />
          <Card className={styles.card}>
            {stats.numSupporters == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numSupporters.toString()}>
                {shortenNumber(stats.numSupporters)}
              </Card.Content>
            )}
            <Card.Legend>Members</Card.Legend>
          </Card>
          <Divider.Horizontal color="black-10" />
          <Card className={styles.card}>
            {stats.numPosts == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content>{stats.numPosts}</Card.Content>
            )}
            <Card.Legend>Posts</Card.Legend>
          </Card>
          <Divider.Horizontal color="black-10" />
          <Card className={styles.card}>
            {stats.numProtocolTransactions == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content>{stats.numProtocolTransactions}</Card.Content>
            )}
            <Card.Legend>Transactions</Card.Legend>
          </Card>
          <Divider.Horizontal color="black-10" />
          <Card className={styles.card}>
            {stats.numLovelaceStakedActive == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numLovelaceStakedActive.toString()}>
                <AssetViewer.Usd.FromAda
                  as="span"
                  lovelaceAmount={stats.numLovelaceStakedActive}
                />
              </Card.Content>
            )}
            <Card.Legend>Active stake</Card.Legend>
          </Card>
          <Divider.Horizontal color="black-10" />
          <Card className={styles.card}>
            {stats.numLovelaceStakedActive == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numLovelaceStakedActive.toString()}>
                <AssetViewer.Usd.FromAda
                  as="span"
                  lovelaceAmount={
                    /** NOTE: @sk-tenba:
                     * monthly income = numLovelacesStaked / 100 * 3.5 / 12
                     */
                    (BigInt(stats.numLovelaceStakedActive) * BigInt(35)) /
                    BigInt(12000)
                  }
                />
              </Card.Content>
            )}
            <Card.Legend>Total Monthly Income</Card.Legend>
          </Card>
        </div>
        {/* <div className={styles.cardGroup}>
          <Card className={styles.card}>
            <Card.Content>{stats.numProjectsActive}</Card.Content>
            <Card.Legend>Active creators</Card.Legend>
          </Card>
          <Card className={styles.card}>
            {stats.numSupportersActive == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numSupportersActive.toString()}>
                {shortenNumber(stats.numSupportersActive)}
              </Card.Content>
            )}
            <Card.Legend>Active backers</Card.Legend>
          </Card>
          <Card className={styles.card}>
            {stats.averageMillisecondsBetweenProjectUpdates === undefined ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content
                title={stats.averageMillisecondsBetweenProjectUpdates.toString()}
              >
                {moment
                  .duration(stats.averageMillisecondsBetweenProjectUpdates)
                  .humanize()}
              </Card.Content>
            )}
            <Card.Legend>Update frequency</Card.Legend>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
