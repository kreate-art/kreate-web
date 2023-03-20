import cx from "classnames";
import * as React from "react";
import { PieChart } from "react-minimal-pie-chart";

import ModalBackProject, {
  ModalBackProject$SuccessEvent,
} from "../../../PageProjectDetails/containers/ModalBackProject";
import ModalBackSuccess from "../../../PageProjectDetails/containers/ModalBackSuccess";
import ModalUnbackProject from "../../../PageProjectDetails/containers/PanelAdjustStake/containers/ModalUnbackProject";
import ModalUnbackSuccess from "../../../PageProjectDetails/containers/PanelAdjustStake/containers/ModalUnbackSuccess";

import IconMore from "./icons/IconMore";
import styles from "./index.module.scss";

import {
  Address,
  LovelaceAmount,
  ProjectBenefitsTier,
} from "@/modules/business-types";
import { assert } from "@/modules/common-utils";
import { useModalPromises } from "@/modules/modal-promises";
import { HttpGetUser$DetailedBackedProject } from "@/modules/next-backend-client/api/httpGetUser";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import DropdownMenu from "@/modules/teiki-ui/components/DropdownMenu";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  backedProjects: HttpGetUser$DetailedBackedProject[] | undefined;
  totalLovelaceAmount$InWallet: LovelaceAmount | undefined;
  onTransactionSubmitted?: () => void;
};

const colorPalette = [
  "#003F5B",
  "#58508C",
  "#BD5091",
  "#FE6361",
  "#FFA600",
  "#72B4EB",
  "#8EA5CC",
];

export default function PanelBackingProjects({
  className,
  style,
  backedProjects,
  totalLovelaceAmount$InWallet,
  onTransactionSubmitted,
}: Props) {
  const { walletStatus } = useAppContextValue$Consumer();
  const { showModal } = useModalPromises();

  const formattedBackedProjects = backedProjects?.map((item, index) => {
    assert(item.project.basics);
    const projectId = item.project.id;
    const projectTitle = item.project.basics.title;
    const backedAmount = item.numLovelacesBacked;
    const color = colorPalette[index % colorPalette.length];
    const logoImage = item.project.basics?.logoImage;
    const tiers = item.project.tiers;
    return { projectId, projectTitle, backedAmount, color, logoImage, tiers };
  });

  const handleBackMore = async ({
    projectTitle,
    projectId,
    projectTiers,
    backedAmount,
  }: {
    projectTitle: string;
    projectId: string;
    projectTiers?: (ProjectBenefitsTier & { activeMemberCount?: number })[];
    backedAmount: LovelaceAmount;
  }) => {
    if (walletStatus.status !== "connected") return;
    type ModalBackProject$ModalResult =
      | { type: "success"; event: ModalBackProject$SuccessEvent }
      | { type: "cancel" };
    const modalBackProject$ModalResult =
      await showModal<ModalBackProject$ModalResult>((resolve) => (
        <ModalBackProject
          open
          projectName={projectTitle}
          projectId={projectId}
          stakingAmount={backedAmount}
          projectTiers={projectTiers}
          onCancel={() => resolve({ type: "cancel" })}
          onSuccess={(event) => resolve({ type: "success", event })}
        />
      ));
    if (modalBackProject$ModalResult.type !== "success") return;
    await showModal<void>((resolve) => (
      <ModalBackSuccess open={true} onClose={resolve} />
    ));
    onTransactionSubmitted && onTransactionSubmitted();
  };

  const handleUnback = async ({
    projectTitle,
    projectId,
    projectStatus,
    projectTiers,
    backedAmount,
  }: {
    projectTitle: string;
    projectId: string;
    projectStatus:
      | "active"
      | "pre-closed"
      | "pre-delisted"
      | "closed"
      | "delisted";
    projectTiers?: (ProjectBenefitsTier & { activeMemberCount?: number })[];
    backerAddress: Address;
    backedAmount: LovelaceAmount;
  }) => {
    console.log(projectTiers, backedAmount);
    type ModalUnbackProject$ModalResult =
      | { type: "cancel" }
      | { type: "success"; unbackLovelaceAmount: LovelaceAmount };
    const modalResult = await showModal<ModalUnbackProject$ModalResult>(
      (resolve) => (
        <ModalUnbackProject
          open
          projectName={projectTitle}
          projectId={projectId}
          backedAmount={backedAmount}
          projectStatus={projectStatus}
          projectTiers={projectTiers}
          onCancel={() => resolve({ type: "cancel" })}
          onSuccess={(event) =>
            resolve({
              type: "success",
              unbackLovelaceAmount: event.unbackLovelaceAmount,
            })
          }
        />
      )
    );
    if (modalResult.type === "success") {
      await showModal((resolve) => (
        <ModalUnbackSuccess
          open
          unbackedAmountLovelace={modalResult.unbackLovelaceAmount}
          projectName={projectTitle}
          onClose={() => resolve(undefined)}
        />
      ));
      onTransactionSubmitted && onTransactionSubmitted();
    }
  };

  const pieChartData:
    | React.ComponentProps<typeof PieChart>["data"]
    | undefined =
    formattedBackedProjects && totalLovelaceAmount$InWallet != null
      ? [
          ...formattedBackedProjects.map((item) => ({
            title: item.projectTitle,
            value: Number(item.backedAmount),
            color: item.color,
          })),
          {
            title: "ADA in wallet",
            value: Number(totalLovelaceAmount$InWallet),
            color: "#2B8355",
          },
        ]
      : undefined;

  const totalLovelace = pieChartData?.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const percentageList = totalLovelace
    ? pieChartData?.map((item) =>
        ((item.value / totalLovelace) * 100).toLocaleString("en-US")
      )
    : undefined;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col>
        <Flex.Cell padding="20px 32px">
          <Typography.Div size="heading5" color="ink" content="Your Kreators" />
        </Flex.Cell>
        <Divider.Horizontal />
        <Flex.Row
          padding="32px"
          gap="32px"
          flexWrap="wrap"
          justifyContent="center"
        >
          <Flex.Col flex="0 0 226px" gap="20px">
            {pieChartData ? (
              <Flex.Cell justifyContent="center">
                <PieChart
                  data={pieChartData}
                  lineWidth={60}
                  label={({ dataEntry }) =>
                    dataEntry.percentage > 10
                      ? Math.round(dataEntry.percentage) + "%"
                      : undefined
                  }
                  labelPosition={70}
                  labelStyle={{
                    fill: "#fff",
                    opacity: 0.75,
                    pointerEvents: "none",
                    fontSize: "6px",
                  }}
                  startAngle={-90}
                />
              </Flex.Cell>
            ) : null}
            <Flex.Row gap="12px" alignItems="center" justifyContent="center">
              <Flex.Cell
                flex="0 0 auto"
                className={styles.circle}
                style={{ backgroundColor: "#2B8355" }}
              />
              <Flex.Col gap="4px">
                <Typography.Div
                  maxLines={1}
                  size="heading6"
                  content="ADA in wallet"
                />
                <Typography.Div color="ink80" size="bodyExtraSmall">
                  <Typography.Span
                    content={`${
                      percentageList
                        ? percentageList[percentageList.length - 1]
                        : "..."
                    }% ≈ `}
                  />
                  <AssetViewer.Ada.Compact
                    as="span"
                    lovelaceAmount={totalLovelaceAmount$InWallet}
                  />
                </Typography.Div>
              </Flex.Col>
            </Flex.Row>
          </Flex.Col>
          <Flex.Col flex="1 1 300px" gap="24px">
            {formattedBackedProjects?.map((item, index) => (
              <Flex.Row key={index} gap="12px" alignItems="center">
                <Flex.Cell
                  flex="0 0 auto"
                  className={styles.circle}
                  style={{ backgroundColor: item.color }}
                ></Flex.Cell>
                {/* Uncomment this part if we want to show the project logos instead */}
                {/* <Flex.Cell flex="0 0 auto">
                  <LogoImageViewer
                    size="small"
                    shadow="none"
                    value={item.logoImage}
                  />
                </Flex.Cell> */}
                <Flex.Col
                  flex="1 1 75px"
                  style={{ minWidth: "75px" }}
                  gap="4px"
                >
                  <Typography.Div
                    maxLines={1}
                    size="heading6"
                    content={item.projectTitle}
                  />
                  <Typography.Div color="ink80" size="bodyExtraSmall">
                    <Typography.Span
                      content={`${
                        percentageList ? percentageList[index] : "..."
                      }% ≈ `}
                    />
                    <AssetViewer.Ada.Compact
                      as="span"
                      lovelaceAmount={item.backedAmount}
                    />
                    <Typography.Span content=" " />
                  </Typography.Div>
                </Flex.Col>
                <Button.Outline
                  content="Stake More"
                  size="small"
                  onClick={() =>
                    handleBackMore({
                      projectId: item.projectId,
                      projectTitle: item.projectTitle || "",
                      projectTiers: item.tiers,
                      backedAmount: item.backedAmount,
                    })
                  }
                />
                <DropdownMenu.Menu
                  trigger={
                    <Button.Outline icon={<IconMore />} size="small" circular />
                  }
                >
                  <DropdownMenu.Item
                    content="Unstake"
                    onSelect={() => {
                      assert(walletStatus.status === "connected");
                      handleUnback({
                        projectTitle: item.projectTitle,
                        projectId: item.projectId,
                        projectStatus: "active", // TODO: @sk-kitsune: fetch from backend this info
                        projectTiers: item.tiers,
                        backerAddress: walletStatus.info.address,
                        backedAmount: item.backedAmount,
                      });
                    }}
                  />
                </DropdownMenu.Menu>
              </Flex.Row>
            ))}
          </Flex.Col>
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}
