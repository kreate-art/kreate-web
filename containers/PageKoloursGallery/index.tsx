import cx from "classnames";
import * as React from "react";

import { useAllNfts } from "../PageKolours/hooks/useAllNfts";

import Section from "./components/Section";
import GenesisNftList from "./containers/GenesisNftList";
import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function PageKoloursGallery({ className, style }: Props) {
  const [useAllNfts$Response, useAllNfts$Error] = useAllNfts();
  return (
    <div className={cx(styles.container, className)} style={style}>
      <Section>
        <Flex.Col gap="16px">
          <Typography.Div content="Genesis NFTs" size="heading6" />
          <GenesisNftList
            value={useAllNfts$Response?.kreations?.filter((item) =>
              ["booked", "minted"].includes(item.status)
            )}
            error={useAllNfts$Error}
          />
        </Flex.Col>
      </Section>
    </div>
  );
}
