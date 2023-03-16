import Image from "next/image";
import * as React from "react";

import { NEXT_PUBLIC_NETWORK } from "../../../../config/client";
import ButtonWalletNavbar from "../../../PageHome/containers/NavBar/containers/ButtonWalletNavbar";

import pngNiko300 from "./assets/niko-300.min.png";
import Callout from "./components/Callout";
import IconGuideline from "./components/IconGuideline";
import IconLeaf from "./components/IconLeaf";
import styles from "./index.module.scss";

import { NETWORK } from "@/modules/env/client";
import { useDefaultBackground } from "@/modules/teiki-components/hooks/useDefaultBackground";
import { LogoKreateFull } from "@/modules/teiki-logos";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Title from "@/modules/teiki-ui/components/Title";

// @sk-kitsune: move this function to a separated file, and clean it up.
// Ideally, this component should not read NEXT_PUBLIC_NETWORK directly.
// This component should be separated into Content.Mainnet and Content.Testnet.
// The caller should conditionally render one among two components.
// Currently, I have no time to do this refactoring.
function Content({
  className,
  onClickGetStarted,
}: {
  className?: string;
  onClickGetStarted?: () => void;
}) {
  return (
    <div className={className}>
      <Callout className={styles.callout} />
      <div className={styles.details}>
        {NEXT_PUBLIC_NETWORK === "Mainnet" ? (
          <div>
            <Title size="h4" color="ink100">
              1. Around 515 ₳ is needed to create a project.
            </Title>
            <ul>
              <li className={styles.itemizedItem}>
                500 ₳ as an on-chain pledge returned when the project is closed.
              </li>
              <li className={styles.itemizedItem}>
                The deposit is fined if deemed inappropriate due to
                impersonation, etc.
              </li>
              <li className={styles.itemizedItem}>
                10-15 ₳ in fixed fees. One can choose to spend more on advanced
                features.
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <Title size="h4" color="ink100">
              1. The testnet app operates on test tokens.
            </Title>
            <ul>
              <li className={styles.itemizedItem}>No real fees are charged.</li>
              <li className={styles.itemizedItem}>No real money is raised.</li>
              <li className={styles.itemizedItem}>
                <span>tADA can be obtained from the </span>
                <a
                  className={styles.faucetLink}
                  href="https://docs.cardano.org/cardano-testnet/tools/faucet"
                  target="_blank"
                  rel="noreferrer"
                >
                  preview testnet faucet
                </a>
                .
              </li>
            </ul>
          </div>
        )}
        <div>
          <Title size="h4" color="ink100">
            2. Submitted content is stored immutably on IPFS.
          </Title>
          <ul>
            <li className={styles.itemizedItem}>
              Be careful with IP-sensitive content.
            </li>
          </ul>
        </div>
        <div>
          <Title size="h4" color="ink100">
            3. Progress is auto-saved locally.
          </Title>
        </div>
        <div className={styles.buttonsContainer}>
          <Button.Solid
            size="large"
            onClick={onClickGetStarted}
            content="Get Started"
            icon={<IconLeaf />}
          />
          <Button.Outline
            size="large"
            onClick={() => {
              window.open(
                NEXT_PUBLIC_NETWORK === "Mainnet"
                  ? "https://docs.teiki.network/mainnet-guidelines/create-a-project"
                  : "https://docs.testnet.teiki.network/testnet-guidelines/create-a-project",
                "_blank"
              );
            }}
            icon={<IconGuideline />}
            content="Guideline"
          />
        </div>
      </div>
    </div>
  );
}

type Props = {
  onClickGetStarted?: () => void;
};

function ProjectEditorLandingPage({ onClickGetStarted }: Props) {
  useDefaultBackground();
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Flex.Row
          className={styles.navContent}
          padding="16px 56px"
          alignItems="center"
          gap="32px"
        >
          <LogoKreateFull network={NETWORK} />
          <div className={styles.buttonNav}>
            <ButtonWalletNavbar />
          </div>
        </Flex.Row>
      </nav>
      <Content
        className={styles.content}
        onClickGetStarted={onClickGetStarted}
      />
      <Image className={styles.niko} src={pngNiko300} alt="" />
    </div>
  );
}

export default ProjectEditorLandingPage;
