import cx from "classnames";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageHome/containers/NavBar";
import Podcast from "../Podcast";

import PanelActivities from "./containers/PanelActivities";
import IconLoading from "./containers/PanelActivities/icons/IconLoading";
import PanelBackingProjects from "./containers/PanelBackingProjects";
import PanelYourAssets from "./containers/PanelYourAssets";
import { useBalanceSummary } from "./hooks/useBalanceSummary";
import styles from "./index.module.scss";

import { UnixTimestamp } from "@/modules/business-types";
import { useUser } from "@/modules/next-backend-client/hooks/useUser";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Flex from "@/modules/teiki-ui/components/Flex";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageProfile({ className, style }: Props) {
  useDefaultBackground();
  const { walletStatus } = useAppContextValue$Consumer();
  const [lastTransactionSubmittedAt, setLastTransactionSubmittedAt] =
    React.useState<UnixTimestamp | undefined>(undefined);

  const [user$Data, user$Error] = useUser(
    {
      address:
        walletStatus.status === "connected"
          ? walletStatus.info.address
          : undefined,
    },
    [lastTransactionSubmittedAt]
  );

  const [balanceSummary, balanceSummary$Error] = useBalanceSummary({
    backedProjects: user$Data?.backedProjects,
  });

  return (
    <>
      <TeikiHead title="Kreate Profile" />
      <div className={cx(styles.container, className)} style={style}>
        <nav>
          <NavBar />
        </nav>
        <article className={styles.article}>
          {(() => {
            switch (walletStatus.status) {
              case "connected":
                return (
                  <Flex.Row gap="20px" flexWrap="wrap">
                    <Flex.Col gap="20px" flex="1 1 500px">
                      <PanelYourAssets
                        lovelaceAmount={balanceSummary?.totalLovelaceAmount}
                        microTeikiAmount={balanceSummary?.totalMicroTeikiAmount}
                        error={user$Error || balanceSummary$Error}
                      />
                      <PanelBackingProjects
                        backedProjects={user$Data?.backedProjects?.filter(
                          (p) => p.isCurrentlyBacking
                        )}
                        totalLovelaceAmount$InWallet={
                          balanceSummary?.totalLovelaceAmount$InWallet
                        }
                        onTransactionSubmitted={() => {
                          setLastTransactionSubmittedAt(Date.now());
                        }}
                      />
                    </Flex.Col>
                    <Flex.Col flex="1 1 500px">
                      <PanelActivities
                        userAddress={walletStatus.info.address}
                        knownDetailedProjects={
                          user$Data
                            ? user$Data.backedProjects
                                .map((item) => item.project)
                                .concat(user$Data.ownProject)
                            : []
                        }
                        lastTransactionSubmittedAt={lastTransactionSubmittedAt}
                      />
                    </Flex.Col>
                  </Flex.Row>
                );
              case "disconnected":
                return (
                  <MessageBox
                    color="danger"
                    title="Wallet not connected"
                    description="Please connect your wallet."
                  />
                );
              default:
                return <IconLoading className={styles.loading} />;
            }
          })()}
        </article>
        <FooterPanel />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
