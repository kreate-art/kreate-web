import cx from "classnames";
import * as React from "react";
import useSWRInfinite from "swr/infinite";

import IconDropdown from "../../icons/IconDropdown";

import ActivityViewer from "./components/ActivityViewer";
import styles from "./index.module.scss";

import {
  Address,
  DetailedProject,
  UnixTimestamp,
} from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { httpGetAllActivities } from "@/modules/next-backend-client/api/httpGetAllActivities";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import DropdownMenu from "@/modules/teiki-ui/components/DropdownMenu";
import Flex from "@/modules/teiki-ui/components/Flex";
import MessageBox from "@/modules/teiki-ui/components/MessageBox";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  knownDetailedProjects: DetailedProject[];
  lastTransactionSubmittedAt: UnixTimestamp | undefined;
  userAddress: Address;
};

type ViewMode = "all-activities" | "your-activities";

export default function PanelActivities({
  userAddress,
  className,
  style,
  knownDetailedProjects,
  lastTransactionSubmittedAt,
}: Props) {
  const { walletStatus } = useAppContextValue$Consumer();
  const walletAddress =
    walletStatus.status === "connected" ? walletStatus.info.address : undefined;

  const [viewMode, setViewMode] = React.useState<ViewMode>("your-activities");

  // https://swr.vercel.app/docs/pagination
  // https://swr.vercel.app/examples/infinite-loading
  const { data, error, size, setSize, isLoading } = useSWRInfinite(
    (pageIndex, prevPageData) => {
      if (walletAddress == null) return null;
      const cursor = prevPageData?.nextCursor;
      if (prevPageData && typeof cursor !== "string") return null;
      return [
        "2a1aa6e7-6695-4429-82c1-39dc67f25970",
        walletAddress,
        cursor,
        pageIndex,
        viewMode,
        lastTransactionSubmittedAt,
      ];
    },
    async ([_, actor, cursor, pageIndex]) => {
      switch (viewMode) {
        case "all-activities":
          return await httpGetAllActivities({
            actor,
            relationship: "backed_or_owned_by",
            cursor,
            limit: pageIndex === 0 ? 15 : pageIndex === 1 ? 35 : 50,
          });
        case "your-activities":
          return await httpGetAllActivities({
            actor,
            relationship: "owned_by",
            cursor,
            limit: pageIndex === 0 ? 15 : pageIndex === 1 ? 35 : 50,
          });
      }
    },
    { initialSize: 1 }
  );

  const allActivities = (data || [])
    .flatMap((item) => (item == null ? [] : item.activities))
    .map((activity) => {
      // TODO: We'd want a less hacky and more "global" solution here, but the goal must be persisted:
      // No-one remembers their address, using "You" in these labels increases the UX massively.
      if (activity.createdBy === userAddress) {
        // Hacky: We're mutably abusing the fact that `Address` is an arbitrary string at the moment.
        activity.createdBy = "You";
        // The ununiform `createdBy` in these types are not neat.
        if (
          activity.action.type === "back" ||
          activity.action.type === "unback"
        ) {
          activity.action.createdBy = "You";
        }
      }
      return activity;
    });

  const displayableError = error
    ? DisplayableError.from(error, "Failed to load activities")
    : undefined;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const isReachingEnd =
    data?.[0]?.nextCursor === null ||
    (data && data[data.length - 1]?.nextCursor === null);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col>
        <Flex.Row padding="20px 32px" flexWrap="wrap">
          <Flex.Cell flex="1 1 auto">
            <Typography.Div
              size="heading5"
              color="ink"
              content="Recent Activities"
            />
          </Flex.Cell>
          <Flex.Row flex="0 0 auto">
            <Typography.Div
              style={{ marginRight: "1em" }}
              content="Filter by:"
              size="bodySmall"
              color="ink80"
            />
            <DropdownMenu.Menu
              trigger={
                <Button.Link>
                  <Flex.Row alignItems="center" justifyContent="center">
                    <Typography.Div
                      size="bodySmall"
                      fontWeight="semibold"
                      color="green"
                      content={
                        viewMode === "all-activities"
                          ? "All Activities"
                          : viewMode === "your-activities"
                          ? "Your Activities"
                          : "-"
                      }
                    />
                    <IconDropdown />
                  </Flex.Row>
                </Button.Link>
              }
            >
              <DropdownMenu.Item
                content="Your Activities"
                onSelect={() => setViewMode("your-activities")}
              />
              <DropdownMenu.Item
                content="All Activities"
                onSelect={() => setViewMode("all-activities")}
              />
            </DropdownMenu.Menu>
          </Flex.Row>
        </Flex.Row>
        <Divider.Horizontal />
        <Flex.Col padding="24px 32px" gap="16px">
          <Flex.Col gap="24px">
            {allActivities.map((activity, index) => (
              <ActivityViewer
                key={index}
                projectActivity={activity}
                projectBasics={
                  knownDetailedProjects.find(
                    (project) => project.id === activity.projectId
                  )?.basics
                }
              />
            ))}
          </Flex.Col>
          {displayableError ? (
            <Flex.Cell>
              <MessageBox
                color="danger"
                title={displayableError.title}
                description={displayableError.description}
              />
            </Flex.Cell>
          ) : null}
          {!isReachingEnd ? (
            <Flex.Row alignItems="center" justifyContent="center">
              <Button.Outline
                content="Load More"
                onClick={() => setSize((size) => size + 1)}
                disabled={isLoadingMore}
              />
            </Flex.Row>
          ) : null}
        </Flex.Col>
      </Flex.Col>
    </div>
  );
}
