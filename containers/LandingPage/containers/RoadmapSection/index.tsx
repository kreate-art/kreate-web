import cx from "classnames";
import Image from "next/image";
import * as React from "react";

import pngColorfulFlower from "./assets/colorful-flower.png";
import PageControl from "./components/PageControl";
import RoadmapList from "./components/RoadmapList";
import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
};

export default function RoadmapSection({ className, style, id }: Props) {
  const [pageIndex, setPageIndex] = React.useState<
    "2023-q1" | "2023-q2" | "2023-q3" | "2023-q4"
  >("2023-q1");

  return (
    <div className={cx(styles.container, className)} style={style} id={id}>
      {/* TODO: Change to Typography.H2 */}
      <Typography.Div
        className={styles.title}
        size="none"
        content="ROADMAP"
        color="white"
      />
      <PageControl
        value={pageIndex}
        options={[
          { value: "2023-q1", label: "Q1 2023" },
          { value: "2023-q2", label: "Q2 2023" },
          { value: "2023-q3", label: "Q3 2023" },
          { value: "2023-q4", label: "Q4 2023" },
        ]}
        onChange={setPageIndex}
      >
        <PageControl.Page value="2023-q1">
          <Flex.Row>
            <Flex.Row
              flex="1 1 360px"
              minWidth="0"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Image
                className={styles.image}
                src={pngColorfulFlower}
                alt=""
                placeholder="blur"
              />
            </Flex.Row>
            <Flex.Cell flex="1 0 480px">
              <RoadmapList>
                <RoadmapList.Completed content="Minting for Kolours and the 99 pieces of Genesis Kreation begins. Mint your Kolour and paint!" />
                <RoadmapList.Completed content="Genesis Kreation minters can name and describe their regions!" />
                <RoadmapList.Completed content="50% OFF minting until April 7!" />
                <RoadmapList.Uncompleted content="Additional discounts for Delegators to Registered SSPOs until April 7." />
                <RoadmapList.Uncompleted content="Sustainable Kreators (5k ADA Stake) get a free Studio NFT, Kreator NFT, and Kolour NFT!" />
                <RoadmapList.Uncompleted content="Loyal Members (subscribed for 1+ epoch till April 7) of Sustainable Kreators get a free Kreator NFT and Kolour NFT!" />
              </RoadmapList>
            </Flex.Cell>
          </Flex.Row>
        </PageControl.Page>
        <PageControl.Page value="2023-q2">
          <Flex.Row>
            <Flex.Row
              flex="1 1 360px"
              minWidth="0"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Image
                className={styles.image}
                src={pngColorfulFlower}
                alt=""
                placeholder="blur"
              />
            </Flex.Row>
            <Flex.Cell flex="1 0 480px">
              <RoadmapList>
                <RoadmapList.Uncompleted content="Minting for Kreator NFTs begins. VR avatars in full 3D, and customisable!" />
                <RoadmapList.Uncompleted content="Holders of Genesis Kreation & Kolour NFTs get early access to Kreator NFT minting!" />
                <RoadmapList.Uncompleted content="Kolour NFT holders get 1% in royalties from Kreator NFT mints." />
                <RoadmapList.Uncompleted content="Genesis Kreation holders get 1% in royalties from Kreator NFT avatars that spawn in their region at mint." />
              </RoadmapList>
            </Flex.Cell>
          </Flex.Row>
        </PageControl.Page>
        <PageControl.Page value="2023-q3">
          <Flex.Row>
            <Flex.Row
              flex="1 1 360px"
              minWidth="0"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Image
                className={styles.image}
                src={pngColorfulFlower}
                alt=""
                placeholder="blur"
              />
            </Flex.Row>
            <Flex.Cell flex="1 0 480px">
              <RoadmapList>
                <RoadmapList.Uncompleted content="Genesis Kreation holders can customise the geography of their piece of the Kreataverse." />
                <RoadmapList.Uncompleted content="Minting of Studio NFTs begins. Kreators can build their Metaverse Studios in these regions to engage and connect with their fans." />
                <RoadmapList.Uncompleted content="Genesis Kreation holders can earn revenue from the land they lease to Kreators and other users of the Kreataverse, e.g. brand sponsorship." />
              </RoadmapList>
            </Flex.Cell>
          </Flex.Row>
        </PageControl.Page>
        <PageControl.Page value="2023-q4">
          <Flex.Row>
            <Flex.Row
              flex="1 1 360px"
              minWidth="0"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Image
                className={styles.image}
                src={pngColorfulFlower}
                alt=""
                placeholder="blur"
              />
            </Flex.Row>
            <Flex.Cell flex="1 0 480px">
              <RoadmapList>
                <RoadmapList.Uncompleted content="Integrated, open world Kreataverse for all!" />
              </RoadmapList>
            </Flex.Cell>
          </Flex.Row>
        </PageControl.Page>
      </PageControl>
    </div>
  );
}
