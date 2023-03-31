import cx from "classnames";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageKolours/containers/NavBar";
import { fromHexColor, toHexColor } from "../PageKolours/utils";

import Section from "./components/Section";
import PanelPickedKolours from "./containers/PanelPickedKolours";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { HOST } from "@/modules/env/client";
import { Kolour } from "@/modules/kolours/types/Kolours";
import Menu$TopNavigation from "@/modules/teiki-components/components/Menu$TopNavigation";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import Button from "@/modules/teiki-ui/components/Button";
import ColorPicker from "@/modules/teiki-ui/components/ColorPicker";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// NOTE: feel free to rename this component
export default function PageMintByColorPicker({ className, style }: Props) {
  useBodyClasses([styles.body]);
  const [pendingKolour, setPendingKolour] = React.useState("000000");
  const [pickedKolours, setPickedKolours] = React.useState<Kolour[]>([]);

  const canAddPendingKolour =
    /^[0-9A-F]{6}$/.test(pendingKolour) &&
    !pickedKolours.includes(pendingKolour);

  return (
    <div className={cx(styles.container, className)} style={style}>
      <TeikiHead
        title="Kolour the Metaverse with NFTs"
        description="Kreate Kolours brings a new trend to Web3, where users colour a Metaverse with NFTs. Let's paint a new world with Web3 creators and fans!"
        url="https://kolours.kreate.community"
        imageUrl={`${HOST}/images/meta-kolour.png?v=1`}
      />
      <NavBar
        className={styles.navBar}
        showGalleryButton={true}
        showMintButton={true}
      />
      <Menu$TopNavigation
        style={{ marginTop: "48px" }}
        items={[
          {
            label: "The Origin of Kolours",
            key: "origins",
            href: "mint",
          },
          {
            label: "Your Kolours",
            key: "yours",
            href: "mint-free",
          },
        ]}
        activeKey="yours"
      />
      <Section marginTop="48px" marginBottom="48px" className={styles.main}>
        <Flex.Row flexWrap="wrap" gap="20px" alignItems="stretch">
          <Flex.Col alignItems="center" flex="7 7 350px">
            <ColorPicker
              value={toHexColor(pendingKolour)}
              onChange={(color) => {
                const kolour = fromHexColor(color);
                if (!kolour) return;
                setPendingKolour(kolour);
              }}
            />
            <Button.Solid
              content="Add to Collection"
              onClick={() => {
                setPickedKolours((value) => [...value, pendingKolour]);
              }}
              disabled={!canAddPendingKolour}
            />
          </Flex.Col>
          <Flex.Col flex="5 5 250px">
            <PanelPickedKolours
              value={pickedKolours}
              onChange={(newValue) => setPickedKolours(newValue)}
            />
          </Flex.Col>
        </Flex.Row>
      </Section>
      <FooterPanel style={{ width: "100%" }} />
    </div>
  );
}
