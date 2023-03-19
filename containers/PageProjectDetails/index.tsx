import cx from "classnames";
import { useRouter } from "next/router";
import * as React from "react";

import { NEXT_PUBLIC_HOST } from "../../config/client";
import NavBar from "../../containers/PageHome/containers/NavBar";
import ModalConnectWallet from "../PageHome/containers/NavBar/containers/ButtonWalletNavbar/containers/ModalConnectWallet";
import ModalPostAnnouncement from "../PageUpdateProjectV2/containers/ModalPostAnnouncement";
import Podcast from "../Podcast";

import FooterPanel from "./../PageHome/containers/FooterPanel";
import Backdrop from "./components/Backdrop";
import IconLoading from "./components/IconLoading";
import IconWarning from "./components/IconWarning";
import ModalBackProject, {
  ModalBackProject$SuccessEvent,
} from "./containers/ModalBackProject";
import ModalBackSuccess from "./containers/ModalBackSuccess";
import ModalWithdrawFund, {
  ModalWithdrawFund$SuccessEvent,
} from "./containers/ModalWithdrawFund";
import ModalWithdrawSuccess from "./containers/ModalWithdrawSuccess";
import PanelActivities from "./containers/PanelActivities";
import PanelAdjustStake from "./containers/PanelAdjustStake";
import ModalUnbackSuccess from "./containers/PanelAdjustStake/containers/ModalUnbackSuccess";
import PanelBenefits from "./containers/PanelBenefits";
import PanelProtocolReward from "./containers/PanelProtocolReward";
import PanelTopBackers from "./containers/PanelTopBackers";
import PanelWithdrawFund from "./containers/PanelWithdrawFund";
import ProjectDetails, { TABS } from "./containers/ProjectDetails";
import ModalCloseProject from "./containers/ProjectOverview/containers/ModalCloseProject";
import ModalShareProject from "./containers/ProjectOverview/containers/ModalShareProject";
import ModalWithdrawWarn from "./containers/ProjectOverview/containers/ModalWithdrawWarn";
import useDetailedProject from "./hooks/useDetailedProject";
import { useProjectMatch } from "./hooks/useProjectMatch";
import { useTotalStakedByBacker } from "./hooks/useTotalStakedByBacker";
import styles from "./index.module.scss";

import { LovelaceAmount } from "@/modules/business-types";
import { useLocationHash } from "@/modules/common-hooks/hooks/useLocationHash";
import { useModalPromises } from "@/modules/modal-promises";
import PanelProjectOverview from "@/modules/teiki-components/components/PanelProjectOverview";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import Title from "@/modules/teiki-ui/components/Title";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  projectId: string | undefined;
  projectCustomUrl: string | undefined;
};

export default function PageProjectDetails({
  className,
  style,
  projectId,
  projectCustomUrl,
}: Props) {
  const { walletStatus, walletAuthHeaderInfo } = useAppContextValue$Consumer();
  const { showModal } = useModalPromises();
  const { showMessage } = useToast();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const hash = useLocationHash();

  const {
    project,
    error: errorProject,
    mutate: mutateProject,
  } = useDetailedProject({
    projectId: typeof projectId === "string" ? projectId : undefined,
    customUrl:
      typeof projectCustomUrl === "string" ? projectCustomUrl : undefined,
    preset: "full",
    authHeader:
      walletAuthHeaderInfo.status === "authenticated"
        ? walletAuthHeaderInfo.info
        : undefined,
  });

  React.useEffect(() => {
    const validHashs = TABS.map((tab) => tab.hash);
    const isHashValid =
      hash != null && Object.values(validHashs).includes(hash);
    if (isHashValid) {
      setActiveTabIndex(validHashs.indexOf(hash));
    } else {
      setActiveTabIndex(0);
    }
  }, [hash, router.asPath]);

  const match = useProjectMatch({
    projectId: project === undefined ? undefined : project.id,
    relevantAddress:
      walletStatus.status === "connected"
        ? walletStatus.info.address
        : undefined,
  });
  const censorshipContents = project?.censorship
    ? project?.censorship.map((value) =>
        value
          .replace("identityAttack", "identity attack")
          .replace("sexualExplicit", "sexual explicit")
      )
    : [];

  const [isUncensored, setIsUncensored] = React.useState(false);
  const isCensored = !isUncensored && censorshipContents.length > 0;

  const { data: totalStaked, mutate: mutateTotalStaked } =
    useTotalStakedByBacker({
      backerAddress:
        walletStatus.status == "connected" ? walletStatus.info.address : "",
      projectId: project ? project.id : "",
    });

  const withdrawableFundLovelaceAmount =
    project?.stats?.numLovelacesAvailable ?? BigInt(0);

  const handleClickButtonBackProject = async () => {
    if (!project || !project.basics || totalStaked == null) return;
    const basics = project.basics;

    switch (walletStatus.status) {
      case "disconnected":
        return void showModal<void>((resolve) => (
          <ModalConnectWallet
            open
            onCancel={() => resolve()}
            onSuccess={() => resolve()}
          />
        ));
      case "connected": {
        type ModalBackProject$ModalResult =
          | { type: "success"; event: ModalBackProject$SuccessEvent }
          | { type: "cancel" };
        const modalBackProject$ModalResult =
          await showModal<ModalBackProject$ModalResult>((resolve) => (
            <ModalBackProject
              open
              projectName={basics.title}
              projectId={project.id}
              isBacking={!!totalStaked?.amount}
              onCancel={() => resolve({ type: "cancel" })}
              onSuccess={(event) => resolve({ type: "success", event })}
            />
          ));
        if (modalBackProject$ModalResult.type !== "success") return;
        mutateProject();
        mutateTotalStaked && mutateTotalStaked();
        await showModal<void>((resolve) => (
          <ModalBackSuccess open={true} onClose={resolve} />
        ));
        return;
      }
      default:
        return showMessage({ title: "Wallet is not ready.", color: "danger" });
    }
  };

  const handleClickButtonWithdrawFund = async ({
    onViewWithdrawalHistory,
    onContinueToClose,
  }: {
    onViewWithdrawalHistory?: () => void;
    onContinueToClose?: () => void;
  }) => {
    if (!project?.basics) return;
    const basics = project.basics;
    switch (walletStatus.status) {
      case "disconnected":
        return void showModal<void>((resolve) => (
          <ModalConnectWallet
            open
            onCancel={() => resolve()}
            onSuccess={() => resolve()}
          />
        ));
      case "connected": {
        type ModalWithdrawFund$ModalResult =
          | { type: "success"; event: ModalWithdrawFund$SuccessEvent }
          | { type: "cancel" };
        const modalWithdrawFund$ModalResult =
          await showModal<ModalWithdrawFund$ModalResult>((resolve) => (
            <ModalWithdrawFund
              open
              projectName={basics.title}
              projectId={project.id}
              withdrawableFundLovelaceAmount={withdrawableFundLovelaceAmount}
              onCancel={() => resolve({ type: "cancel" })}
              onSuccess={(event) => resolve({ type: "success", event })}
            />
          ));
        if (modalWithdrawFund$ModalResult.type === "cancel") return;
        await showModal<void>((resolve) => (
          <ModalWithdrawSuccess
            open
            projectName={basics.title}
            txHash={modalWithdrawFund$ModalResult.event.txHash}
            onBackToProject={() => resolve()}
            onContinueToClose={onContinueToClose}
            onViewWithdrawalHistory={onViewWithdrawalHistory}
          />
        ));
        // NOTE: @sk-tenba: Trigger revalidation and refresh data from getServerSideProps
        mutateProject();
        mutateTotalStaked && mutateTotalStaked();
        return;
      }
    }
  };

  const handleClickButtonUpdateProject = () => {
    if (!project) return;
    router.push(`/kreator-by-id/${project.id}/update`);
  };

  const handleClickButtonShare = () => {
    void showModal<void>((resolve) => (
      <ModalShareProject showModalShareProject close={() => resolve()} />
    ));
  };

  const handleClickButtonPostUpdate = () => {
    if (!project) return;
    void showModal<void>((resolve) => (
      <ModalPostAnnouncement
        open
        projectId={project.id}
        projectTiers={project.tiers ?? []}
        labelAction="Submit"
        onSuccess={() => {
          resolve();
          mutateProject();
        }}
        onExit={() => {
          resolve();
        }}
        hideSkipButton
        submitOnAction
      />
    ));
  };

  const handleClose = () => {
    if (!project?.basics) return;
    const basics = project.basics;
    void showModal<void>((resolve) => (
      <ModalCloseProject
        open
        projectId={project.id}
        projectName={basics.title}
        onCancel={() => resolve()}
        onSuccess={() => resolve()}
      />
    ));
  };

  const handleWithdrawWarn = ({
    projectName,
    withdrawableFundLovelaceAmount,
  }: {
    projectName: string;
    withdrawableFundLovelaceAmount: LovelaceAmount;
  }) => {
    void showModal<void>((resolve) => (
      <ModalWithdrawWarn
        open
        projectName={projectName}
        withdrawableFundLovelaceAmount={withdrawableFundLovelaceAmount}
        onCancel={() => resolve()}
        onClick={() =>
          handleClickButtonWithdrawFund({ onContinueToClose: handleClose })
        }
      />
    ));
  };

  const handleClickButtonCloseProject = () => {
    if (!project?.basics || project.stats?.numLovelacesAvailable === undefined)
      return;
    const basics = project.basics;
    project.stats.numLovelacesAvailable
      ? handleWithdrawWarn({
          projectName: basics.title,
          withdrawableFundLovelaceAmount: project.stats.numLovelacesAvailable,
        })
      : handleClose();
  };

  // TODO: @sk-saru -> @sk-kitsune improve the render
  const isUserCreator =
    !!project?.history?.createdBy &&
    walletStatus.status === "connected" &&
    walletStatus.info.addressDetails.paymentCredential?.hash ===
      walletStatus.lucid.utils.getAddressDetails(project.history.createdBy)
        .paymentCredential?.hash;

  return (
    <>
      <TeikiHead
        title={project?.basics?.title}
        description={project?.basics?.summary}
        imageUrl={project?.basics?.coverImages[0]?.url}
        url={`${NEXT_PUBLIC_HOST}/k/${project?.basics?.customUrl}`}
      />
      <div
        className={cx(
          className,
          styles.container,
          isCensored ? styles.pageContainerCensored : null
        )}
        style={style}
      >
        <nav className={styles.nav}>
          <NavBar />
        </nav>
        <main className={styles.main}>
          {errorProject ? (
            <div>ERROR</div>
          ) : !project ? (
            <IconLoading className={styles.loading} />
          ) : (
            <>
              {isCensored ? (
                <div className={styles.censoredItemContainer}>
                  <IconWarning />
                  <Title
                    content="Content Warning!"
                    size="h3"
                    className={styles.censoredItemTitle}
                  />
                  {/**TODO: @sk-tenba: more accurate content description */}
                  <Typography.Div className={styles.censoredItemDescription}>
                    This kreator provides {censorshipContents.join(", ")}{" "}
                    content which may be inappropriate for some audiences and
                    children
                  </Typography.Div>
                  <Button.Outline
                    className={styles.censoredItemButton}
                    content="I understand and want to see"
                    onClick={() => setIsUncensored(true)}
                  />
                </div>
              ) : null}
              {!project ||
              !project.basics ||
              !project.description ||
              !project.community ||
              !project.history ||
              !project.categories ||
              !project.stats ||
              project.announcements === undefined ||
              project.activities === undefined ? null : (
                <div className={styles.content}>
                  <Backdrop
                    className={styles.backdrop}
                    coverImages={project?.basics?.coverImages}
                  />
                  <div className={styles.header}>
                    <PanelProjectOverview
                      basics={project.basics}
                      history={project.history}
                      categories={project.categories}
                      stats={project.stats}
                      match={match}
                      community={project.community}
                      options={{
                        buttonBackProject: {
                          visible: !isUserCreator,
                          isBacking: !!totalStaked?.amount,
                          disabled:
                            !!project.history.closedAt ||
                            walletStatus.status !== "connected" ||
                            totalStaked == null,
                          onClick: handleClickButtonBackProject,
                        },
                        buttonUpdateProject: {
                          visible: isUserCreator,
                          disabled: !!project.history.closedAt,
                          onClick: handleClickButtonUpdateProject,
                        },
                        buttonShare: {
                          visible: true,
                          disabled: !!project.history.closedAt,
                          onClick: handleClickButtonShare,
                        },
                        buttonPostUpdate: {
                          visible: isUserCreator,
                          disabled: !!project.history.closedAt,
                          onClick: handleClickButtonPostUpdate,
                        },
                        buttonCloseProject: {
                          visible: isUserCreator,
                          disabled: !!project.history.closedAt,
                          onClick: handleClickButtonCloseProject,
                        },
                      }}
                    />
                  </div>
                  {!project.tiers ? null : (
                    <PanelBenefits
                      value={project.tiers}
                      onClickBecomeMember={handleClickButtonBackProject}
                    />
                  )}
                  <div className={styles.detailsStatsPanels}>
                    <div className={styles.mainPanels}>
                      <ProjectDetails
                        // We set `key={project.id}` so what when `location.href` changes,
                        // `ProjectDetails` state (including its children) is reset.
                        key={project.id}
                        className={styles.details}
                        projectId={project.id}
                        description={project.description}
                        community={project.community}
                        announcements={project.announcements}
                        activities={project.activities}
                        activeTabIndex={activeTabIndex}
                        totalStaked={totalStaked?.amount}
                        tiers={project.tiers}
                        onChangeActiveTabIndex={(value) => {
                          history.pushState(null, "", TABS[value].hash);
                          setActiveTabIndex(value);
                          const item = document.getElementById(
                            TABS[value].hash.substring(1)
                          );
                          if (item) {
                            item.scrollIntoView();
                          }
                        }}
                        onClickBecomeMember={handleClickButtonBackProject}
                      />
                    </div>
                    <div className={styles.rightPanels}>
                      {walletStatus.status === "connected" ? (
                        <PanelProtocolReward
                          projectId={project.id}
                          projectTitle={project.basics.title}
                          backerAddress={walletStatus.info.address}
                          projectStatus={
                            project.history.closedAt
                              ? "closed"
                              : project.history.delistedAt
                              ? "delisted"
                              : "active"
                          }
                        />
                      ) : null}

                      {walletStatus.status !==
                      "connected" ? null : !isUserCreator ? (
                        totalStaked?.amount ? (
                          <PanelAdjustStake
                            projectName={project.basics.title}
                            projectId={project.id}
                            projectStatus={
                              project.history.closedAt
                                ? "closed"
                                : project.history.delistedAt
                                ? "delisted"
                                : "active"
                            }
                            backerAddress={walletStatus.info.address}
                            openModalBackProject={handleClickButtonBackProject}
                            backedAmount={totalStaked?.amount}
                            onUnbackSuccess={(
                              projectName,
                              unbackedAmountLovelace
                            ) => {
                              mutateProject();
                              mutateTotalStaked && mutateTotalStaked();
                              void showModal((resolve) => (
                                <ModalUnbackSuccess
                                  open={true}
                                  unbackedAmountLovelace={
                                    unbackedAmountLovelace
                                  }
                                  projectName={projectName}
                                  onClose={() => resolve(undefined)}
                                />
                              ));
                            }}
                          />
                        ) : null
                      ) : withdrawableFundLovelaceAmount > 0 ? (
                        <PanelWithdrawFund
                          lovelaceAmount={withdrawableFundLovelaceAmount}
                          onClick={() => handleClickButtonWithdrawFund({})}
                        />
                      ) : null}

                      {project.topSupporters ? (
                        <PanelTopBackers value={project.topSupporters} />
                      ) : null}

                      {!project.activities ? null : (
                        <PanelActivities
                          value={project.activities}
                          onClickAllActivities={() => {
                            history.pushState(null, "", "#activities");
                            setActiveTabIndex(4);
                            const item = document.getElementById("activities");
                            if (item) {
                              item.scrollIntoView();
                            }
                          }}
                          id="all_activities_button"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        <FooterPanel />
        <Podcast podcastClassName={styles.podcast} />
      </div>
    </>
  );
}
