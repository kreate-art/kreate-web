import cx from "classnames";
import moment from "moment";
import * as React from "react";

import Card from "./components/Card";
import styles from "./index.module.scss";
import { shortenNumber } from "./utils";

import { ProtocolStatistics } from "@/modules/business-types";

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
          <Card className={styles.card}>
            {stats.numPosts == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content>{stats.numPosts}</Card.Content>
            )}
            <Card.Legend>Posts</Card.Legend>
          </Card>
          <Card className={styles.card}>
            {stats.numProtocolTransactions == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content>{stats.numProtocolTransactions}</Card.Content>
            )}
            <Card.Legend>Transactions</Card.Legend>
          </Card>
          <Card className={styles.card}>
            {stats.numLovelaceStakedActive == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numLovelaceStakedActive.toString()}>
                {"≈ "}
                {shortenNumber(stats.numLovelaceStakedActive, { shift: -6 })}
                {" ₳"}
              </Card.Content>
            )}
            <Card.Legend>Active stake</Card.Legend>
          </Card>
          <Card className={styles.card}>
            {stats.numLovelaceRaised == null ? (
              <Card.Content>-</Card.Content>
            ) : (
              <Card.Content title={stats.numLovelaceRaised.toString()}>
                {"≈ "}
                {shortenNumber(stats.numLovelaceRaised, { shift: -6 })}
                {" ₳"}
              </Card.Content>
            )}
            <Card.Legend>Total Creator Income</Card.Legend>
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
