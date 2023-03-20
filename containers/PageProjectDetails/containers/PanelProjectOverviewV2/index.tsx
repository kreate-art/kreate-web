import cx from "classnames";
import * as React from "react";

import WithAspectRatio from "../../../../components/WithAspectRatio";

import BannerCarousel from "./components/BannerCarousel";
import HistoryViewer from "./components/HistoryViewer";
import styles from "./index.module.scss";

import { DetailedProject } from "@/modules/business-types";
import BadgesViewer from "@/modules/teiki-components/components/PanelProjectOverview/containers/BadgesViewer";
import SocialChannelsViewer from "@/modules/teiki-components/components/PanelProjectOverview/containers/SocialChannelsViewer";
import TagsViewer from "@/modules/teiki-components/components/PanelProjectOverview/containers/TagsViewer";
import Divider$Horizontal$CustomDash from "@/modules/teiki-ui/components/Divider$Horizontal$CustomDash";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

// a subset of necessary fields from DetailedProject
type IProject = {
  basics: NonNullable<DetailedProject["basics"]>;
  history: NonNullable<DetailedProject["history"]>;
  community: NonNullable<DetailedProject["community"]>;
  categories: NonNullable<DetailedProject["categories"]>;
};

type Props = {
  className?: string;
  style?: React.CSSProperties;
  project: IProject;
};

export default function PanelProjectOverviewV2({
  className,
  style,
  project,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      {/* we will allocate the toolbar 300px width by default
      if the width is less than 300px, we minimize the toolbar
      its min width is 104px *
      
      let's implement a carousel for this component
  */}
      <WithAspectRatio aspectRatio={21 / 9}>
        <BannerCarousel
          items={[
            ...project.basics.coverImages,
            {
              type: "image",
              url: "https://ipfs-testnet.teiki.network/ipfs/QmcofYnpbvb9tL8RerpR79kCfEExJFQZMcBixEKi4QykZ8",
              x: 0.0416907375312921,
              y: 0,
              width: 0.888888888888889,
              height: 1,
            },
            {
              type: "image",
              url: "https://ipfs.testnet.kreate.community/ipfs/QmR9ek3y93Msr4hsPdtQEbzUrjLkaNSxmoznVhPX4WguRG",
              x: 0.03333333333333336,
              y: 0,
              width: 0.9333333333333332,
              height: 1,
            },
          ].map((item) => ({
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
      <Flex.Row>
        <Flex.Cell
          flex="0 1000 300px"
          minWidth="104px"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.01)" }}
        ></Flex.Cell>
        <Flex.Cell flex="1 1 600px" className={styles.textCenter}>
          <Typography.H1
            className={styles.title}
            size="heading1"
            content={project.basics.title}
          />
          <Typography.Div
            className={styles.slogan}
            role="doc-subtitle"
            size="heading4"
            color="ink80"
            content={project.basics.slogan}
          />
        </Flex.Cell>
        <Flex.Cell
          flex="0 1000 300px"
          minWidth="104px"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.01)" }}
        ></Flex.Cell>
      </Flex.Row>
      <Flex.Col
        style={{ margin: "0 auto 56px auto" }}
        maxWidth="654px"
        gap="20px"
      >
        <Flex.Col>
          <Flex.Row className={styles.history} justifyContent="center">
            <HistoryViewer value={project.history} />
          </Flex.Row>
          <Flex.Row className={styles.socialChannels} justifyContent="center">
            <SocialChannelsViewer
              value={project.community.socialChannels}
              hideLabel
            />
          </Flex.Row>
          <Flex.Row className={styles.tags} justifyContent="center">
            <TagsViewer value={project.basics.tags} hideLabel />
          </Flex.Row>
        </Flex.Col>
        <Divider$Horizontal$CustomDash />
        <Typography.Div content={project.basics.summary} color="ink80" />
        <Flex.Row justifyContent="center">
          <BadgesViewer
            value={{
              ...project.categories,
              closed: !!project.history.closedAt,
            }}
          />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}
