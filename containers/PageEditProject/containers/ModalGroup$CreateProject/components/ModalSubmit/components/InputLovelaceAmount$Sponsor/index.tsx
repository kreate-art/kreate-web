import cx from "classnames";

import { useAllProjects } from "../../../../../../../PageHome/hooks/useAllProjects";

import IconClose from "./icons/IconClose";
import styles from "./index.module.scss";

import { rankOf, sortedBy } from "@/modules/array-utils";
import { formatUsdAmount } from "@/modules/bigint-utils";
import { LovelaceAmount } from "@/modules/business-types";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Flex from "@/modules/teiki-ui/components/Flex";
import Input from "@/modules/teiki-ui/components/Input";
import Typography from "@/modules/teiki-ui/components/Typography";

const MAX_DISPLAYED_RANK = 3;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  // props for logic
  projectId?: string; // for creating project, projectId is undefined
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  // props for displaying
  inlineError?: string;
  lovelaceAmount?: LovelaceAmount;
  open: boolean;
  disabled?: boolean;
};

const TopSponsors = "div"; // for readability only
const DescriptionGroup = "div"; // for readability only
const LeftDescription = "div"; // for readability only
const RightDescription = "div"; // for readability only

export default function InputLovelaceAmount$Sponsor({
  className,
  style,
  projectId,
  value,
  onChange,
  onFocus,
  onBlur,
  inlineError,
  lovelaceAmount,
  open,
  disabled,
}: Props) {
  const { walletStatus, adaPriceInfo } = useAppContextValue$Consumer();
  const adaPriceInUsd = adaPriceInfo?.usd;
  const topSponsorProjectsResponse = useAllProjects({
    active: true,
    category: "sponsor",
  });

  const topSponsorWithCurrentProject = (
    topSponsorProjectsResponse.error || !topSponsorProjectsResponse.data
      ? []
      : lovelaceAmount && inlineError == null
      ? [
          ...topSponsorProjectsResponse.data.projects,
          ...(topSponsorProjectsResponse.data.projects.find(
            (project) => project.id === projectId
          )
            ? []
            : [
                {
                  basics: { title: "Your project" },
                  sponsorshipAmount: lovelaceAmount,
                  isCurrentProject: true,
                },
              ]),
        ]
      : topSponsorProjectsResponse.data.projects
  ).map((project) =>
    "isCurrentProject" in project ||
    ("id" in project && project.id === projectId)
      ? {
          ...project,
          basics: { title: "Your project" },
          sponsorshipAmount:
            lovelaceAmount && inlineError == null
              ? lovelaceAmount
              : project.sponsorshipAmount,
          isCurrentProject: true,
        }
      : project
  );

  const sortedItems = sortedBy(
    topSponsorWithCurrentProject,
    (item) => -(item.sponsorshipAmount ?? 0)
  )
    .filter((item) => item.sponsorshipAmount != null)
    .map((item) => ({
      ...item,
      rank: rankOf(item, topSponsorWithCurrentProject, (value) =>
        BigInt(value.sponsorshipAmount ?? 0)
      ),
    }));
  const currentProjectRank = sortedItems.find(
    (item) => "isCurrentProject" in item
  )?.rank;

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Input
        value={
          open || !!inlineError || value === ""
            ? value
            : `#${currentProjectRank} (Your project) ${value}  ₳ / month`
        }
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder="Enter amount"
        color="green"
        disabled={disabled}
        error={!!inlineError && value !== ""}
        rightSlot={
          open || !!inlineError || value === "" ? (
            <Typography.Div
              content="₳ / month"
              size="heading6"
              color="green"
              className={styles.adaSymbol}
            />
          ) : (
            <Typography.Div
              className={styles.closeSymbol}
              content={<IconClose />}
              onClick={() => onChange && onChange("")}
            />
          )
        }
      />
      <DescriptionGroup className={styles.descriptionGroup}>
        <LeftDescription>
          {!value ? (
            <span>&nbsp;</span>
          ) : inlineError ? (
            <span style={{ color: "#dc2020" }}>{inlineError}</span>
          ) : lovelaceAmount && adaPriceInUsd ? (
            <span>
              {formatUsdAmount(
                { lovelaceAmount, adaPriceInUsd },
                {
                  includeAlmostEqualToSymbol: true,
                  includeCurrencySymbol: true,
                }
              )}
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </LeftDescription>
        <RightDescription>
          {walletStatus.status === "connected" ? (
            <span>
              <span>Your Balance: </span>
              <span style={{ fontWeight: "700" }}>
                <AssetViewer.Ada.Standard
                  as="span"
                  lovelaceAmount={walletStatus.info.lovelaceAmount}
                />
                <span>{" ("}</span>
                <AssetViewer.Usd.FromAda
                  as="span"
                  lovelaceAmount={walletStatus.info.lovelaceAmount}
                />
                <span>{")"}</span>
              </span>
            </span>
          ) : (
            <span>Wallet not connected</span>
          )}
        </RightDescription>
      </DescriptionGroup>
      {!open || !sortedItems.length ? null : (
        <>
          <TopSponsors className={styles.top}>
            <Typography.Div
              content="Sponsor status"
              size="bodyExtraSmall"
              color="ink80"
            />
            {sortedItems
              .slice(0, 3)
              .filter((item) => item.rank <= MAX_DISPLAYED_RANK)
              .map((item, index) => {
                return (
                  <Flex.Row
                    key={index}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography.Div
                      content={`#${item.rank} (${item.basics.title})`}
                      size="heading6"
                      color={"isCurrentProject" in item ? "orange" : "ink"}
                      maxLines={1}
                    />
                    <Typography.Div maxLines={1} className={styles.amount}>
                      <Typography.Span
                        content={
                          <AssetViewer.Ada.Standard
                            as="span"
                            lovelaceAmount={item.sponsorshipAmount ?? 0}
                          />
                        }
                        size="bodySmall"
                      />
                      <Typography.Span
                        content=" / month"
                        size="bodySmall"
                        color="ink80"
                      />
                    </Typography.Div>
                  </Flex.Row>
                );
              })}
          </TopSponsors>
        </>
      )}
    </div>
  );
}
