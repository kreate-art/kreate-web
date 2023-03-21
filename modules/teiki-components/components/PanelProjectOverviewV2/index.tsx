import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";
import LogoImageViewer from "../LogoImageViewer";
import BadgesViewer from "../PanelProjectOverview/containers/BadgesViewer";
import HistoryViewerV2 from "../PanelProjectOverview/containers/HistoryViewerV2";
import ButtonSocialChannel from "../PanelProjectOverview/containers/SocialChannelsViewer/components/ButtonSocialChannel";
import TagsViewer from "../PanelProjectOverview/containers/TagsViewer";

import BannerCarousel from "./components/BannerCarousel";
import Section from "./components/Section";
import Toolbar from "./components/Toolbar";
import styles from "./index.module.scss";
import { Options } from "./types";

import {
  ProjectBasics,
  ProjectCategories,
  ProjectCommunity,
  ProjectHistory,
} from "@/modules/business-types";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  basics: ProjectBasics;
  history: ProjectHistory;
  community: ProjectCommunity;
  categories: ProjectCategories;
  match: number | undefined;
  options: Options;
};

export default function PanelProjectOverviewV2({
  className,
  style,
  basics,
  history,
  community,
  categories,
  match,
  options,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <WithAspectRatio aspectRatio={21 / 9}>
        <BannerCarousel
          items={basics.coverImages.map((item) => ({
            type: "image",
            src: item.url,
            crop: {
              x: item.x,
              y: item.y,
              w: item.width,
              h: item.height,
            },
          }))}
          fill
        />
      </WithAspectRatio>
      <div className={styles.main}>
        <LogoImageViewer
          className={styles.logo}
          value={basics.logoImage}
          border="medium"
          size="large"
        />
        <Toolbar className={styles.toolbar} options={options} />
        <Section maxWidth="small">
          <Typography.H1
            className={styles.title}
            size="heading1"
            content={basics.title}
          />
        </Section>
        <Section maxWidth="small" marginTop="8px">
          <Typography.Div
            className={styles.slogan}
            role="doc-subtitle"
            size="heading4"
            color="ink80"
            content={basics.slogan}
          />
        </Section>
        <Section marginTop="20px" marginBottom="20px">
          <Flex.Row justifyContent="center">
            <HistoryViewerV2 value={history} match={match} />
          </Flex.Row>
        </Section>
        <Section marginTop="20px" marginBottom="20px">
          <Flex.Row gap="12px" flexWrap="wrap" justifyContent="center">
            {community.socialChannels.map((url, index) => (
              <ButtonSocialChannel key={index} value={url} />
            ))}
          </Flex.Row>
        </Section>
        <Section marginTop="16px" marginBottom="16px">
          <Flex.Row justifyContent="center">
            <TagsViewer value={basics.tags} hideLabel />
          </Flex.Row>
        </Section>
        <Section marginTop="20px" marginBottom="20px">
          <Divider$Horizontal$CustomDash />
        </Section>
        <Section textAlign="left" marginTop="20px" marginBottom="20px">
          <Typography.Div
            style={{ whiteSpace: "pre-wrap" }}
            content={basics.summary}
            color="ink80"
          />
        </Section>
        <Section>
          <Flex.Row justifyContent="center">
            <BadgesViewer
              value={{ ...categories, closed: !!history.closedAt }}
            />
          </Flex.Row>
        </Section>
      </div>
    </div>
  );
}
