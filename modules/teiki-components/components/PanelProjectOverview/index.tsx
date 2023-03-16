import cx from "classnames";
import * as React from "react";

import ProjectImageCropped from "../../../../containers/PageHome/components/ProjectImageCropped";
import { DEFAULT_LOGO_IMAGE } from "../LogoImageViewer/constants";

import Flex from "./components/Flex";
import ActiveStakeViewer from "./containers/ActiveStakeViewer";
import BadgesViewer from "./containers/BadgesViewer";
import ButtonGroup from "./containers/ButtonGroup";
import HistoryViewer from "./containers/HistoryViewer";
import OtherStatsViewer from "./containers/OtherStatsViewer";
import SocialChannelsViewer from "./containers/SocialChannelsViewer";
import TagsViewer from "./containers/TagsViewer";
import TitleSloganViewer from "./containers/TitleSloganViewer";
import styles from "./index.module.scss";
import { Options } from "./types";

import {
  ProjectBasics,
  ProjectCommunity,
  ProjectGeneralInfo,
} from "@/modules/business-types";
import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  basics: ProjectBasics;
  history: ProjectGeneralInfo["history"];
  categories: ProjectGeneralInfo["categories"];
  stats: ProjectGeneralInfo["stats"];
  match?: ProjectGeneralInfo["match"];
  community: ProjectCommunity;
  options: Options;
};

const LeftColumn = Flex.Col; // for readability only
const RightColumn = Flex.Col; // for readability only
const Summary = "div"; // for readability only

export default function PanelProjectOverview({
  className,
  style,
  basics,
  history,
  categories,
  stats,
  match,
  community,
  options,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Row flexWrap="wrap">
        <LeftColumn
          gap="20px"
          flex="1 1 500px"
          minWidth="0"
          padding="56px 56px 48px 152px"
          position="relative"
        >
          <div className={styles.logoImage}>
            <ProjectImageCropped
              style={{ width: "100%", height: "100%" }}
              value={basics.logoImage || DEFAULT_LOGO_IMAGE}
            />
          </div>
          <Flex.Col gap="16px">
            <TitleSloganViewer title={basics.title} slogan={basics.slogan} />
            <HistoryViewer value={{ ...history, match }} />
            <SocialChannelsViewer value={community.socialChannels} />
            <TagsViewer value={basics.tags} />
          </Flex.Col>
          <Divider.Horizontal />
          <Summary className={styles.summary} title={basics.summary}>
            {basics.summary}
          </Summary>
          {categories.featured || categories.sponsor || !!history.closedAt ? (
            <BadgesViewer
              value={{ ...categories, closed: !!history.closedAt }}
            />
          ) : null}
        </LeftColumn>
        {/* TODO: @sk-kitsune: currently, the Divider.Vertical disappears
        when the parent div wraps. Fix this by extending `Flex.Row` */}
        <Divider.Vertical />
        <RightColumn flex="1 1 500px" minWidth="0">
          <Flex.Cell flex="0 0 auto" padding="56px 56px 12px 56px">
            <ActiveStakeViewer value={stats.numLovelacesStaked ?? null} />
          </Flex.Cell>
          <Flex.Cell flex="1 0 auto" padding="12px 56px 32px 56px">
            <OtherStatsViewer value={{ ...stats, ...history }} />
          </Flex.Cell>
          <Divider.Horizontal />
          <ButtonGroup options={options} />
        </RightColumn>
      </Flex.Row>
    </div>
  );
}
