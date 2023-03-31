import cx from "classnames";
import * as React from "react";

import FooterPanel from "../PageHome/containers/FooterPanel";
import NavBar from "../PageKolours/containers/NavBar";
import { fromHexColor, toHexColor } from "../PageKolours/utils";

import Section from "./components/Section";
import PanelPickedKolours from "./containers/PanelPickedKolours";
import { useFreeKolour } from "./containers/PanelPickedKolours/hooks/useFreeKolour";
import IconAdd from "./icons/IconAdd";
import styles from "./index.module.scss";

import useBodyClasses from "@/modules/common-hooks/hooks/useBodyClasses";
import { HOST } from "@/modules/env/client";
import { Kolour } from "@/modules/kolours/types/Kolours";
import Menu$TopNavigation from "@/modules/teiki-components/components/Menu$TopNavigation";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import { useToast } from "@/modules/teiki-contexts/contexts/ToastContext";
import Button from "@/modules/teiki-ui/components/Button";
import ColorPicker from "@/modules/teiki-ui/components/ColorPicker";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

// NOTE: feel free to rename this component
export default function PageMintFree({ className, style }: Props) {
  useBodyClasses([styles.body]);
  const { showMessage } = useToast();
  const { walletStatus } = useAppContextValue$Consumer();
  const [pendingKolour, setPendingKolour] = React.useState("000000");
  const [pickedKolours, setPickedKolours] = React.useState<Kolour[]>([]);
  const freeKolour$Response = useFreeKolour({
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
  });

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
            label: "Kolour the Kreataverse",
            key: "origins",
            href: "/mint",
          },
          {
            label: "Free Mint",
            key: "yours",
            href: "/mint-free",
          },
        ]}
        activeKey="yours"
      />
      <Section marginBottom="48px" className={styles.main}>
        <div style={{ margin: "20px 0px" }}>
          Please see this{" "}
          <a
            href="https://twitter.com/KreatePlatform/status/1640436459378475009"
            target="_blank"
            rel="noreferrer"
          >
            Tweet
          </a>{" "}
          on how to get a free mint!
        </div>
        <Flex.Row flexWrap="wrap" gap="20px" alignItems="stretch">
          <Flex.Col alignItems="center" flex="7 7 350px">
            <ColorPicker
              value={toHexColor(pendingKolour)}
              onChange={(color) => {
                const kolour = fromHexColor(color);
                if (!kolour) return;
                setPendingKolour(kolour);
              }}
              buttonSlot={
                <div>
                  <Button.Solid
                    content="Add to Collection"
                    color="white"
                    icon={<IconAdd />}
                    onClick={() => {
                      if (
                        freeKolour$Response?.error != null ||
                        !freeKolour$Response?.data
                      )
                        return;
                      if (
                        freeKolour$Response.data.used + pickedKolours.length >=
                        freeKolour$Response.data.total
                      ) {
                        showMessage({
                          title: "You are out of free kolour",
                          color: "danger",
                        });
                      } else {
                        setPickedKolours((value) => [...value, pendingKolour]);
                      }
                    }}
                    disabled={
                      !canAddPendingKolour ||
                      freeKolour$Response?.error != null ||
                      !freeKolour$Response?.data
                    }
                  />
                </div>
              }
            />
          </Flex.Col>
          <Flex.Col flex="5 5 250px">
            <PanelPickedKolours
              value={pickedKolours}
              onChange={(newValue) => setPickedKolours(newValue)}
              freeKolourResponse={freeKolour$Response}
              fill
            />
          </Flex.Col>
        </Flex.Row>
      </Section>
      <FooterPanel style={{ width: "100%" }} />
    </div>
  );
}
