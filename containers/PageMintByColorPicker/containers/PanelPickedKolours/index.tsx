import cx from "classnames";
import * as React from "react";

import ModalFreeMintKolour from "../../../PageKolours/containers/ModalFreeMintKolour";
import { useQuoteFreeKolourNft$Nft } from "../../../PageKolours/containers/ModalFreeMintKolour/hooks/useQuoteFreeKolourNft";

import styles from "./index.module.scss";

import { Kolour } from "@/modules/kolours/types/Kolours";
import { useModalPromises } from "@/modules/modal-promises";
import { useAppContextValue$Consumer } from "@/modules/teiki-contexts/contexts/AppContext";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolour[];
};

export default function PanelPickedKolours({ className, style, value }: Props) {
  const { walletStatus } = useAppContextValue$Consumer();
  const quoteResult = useQuoteFreeKolourNft$Nft({
    kolours: value.map((item) => item),
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
    source: { type: "free" },
  });

  const { showModal } = useModalPromises();

  const handleSubmit = async () => {
    type ModalFreeMintKolour$ModalResult = "success" | "canceled";

    const modalResult$ModalFreeMintKolour =
      await showModal<ModalFreeMintKolour$ModalResult>((resolve) => {
        return (
          <ModalFreeMintKolour
            open
            source={{ type: "free" }}
            kolours={value}
            onSuccess={() => resolve("success")}
            onCancel={() => resolve("canceled")}
          />
        );
      });

    if (modalResult$ModalFreeMintKolour === "success") {
      // TODO: show the success modal
      alert("Success!");
    }
  };

  return (
    <div className={cx(styles.container, className)} style={style}>
      <Flex.Col className={styles.content} alignItems="stretch">
        <Flex.Row
          padding="24px"
          alignItems="center"
          justifyContent="space-between"
          flex="0 0 auto"
        >
          <Typography.Div content="Collection" size="heading6" />
          {/* TODO: do not hard code */}
          <Typography.Div
            content="15/30 Free Kolours Remaining"
            size="bodyExtraSmall"
          />
        </Flex.Row>
        <Divider.Horizontal />
        <Flex.Col flex="1 1 200px" minHeight="0">
          <div className={styles.scrollBox} style={{ maxWidth: "480px" }}>
            {/* TODO: display properly */}
            <pre>{JSON.stringify(value, null, 2)}</pre>
            <pre>{JSON.stringify({ quoteResult }, null, 2)}</pre>
          </div>
        </Flex.Col>
        <Divider.Horizontal />
        <Flex.Row
          flex="0 0 auto"
          alignItems="center"
          justifyContent="space-between"
          padding="16px 24px"
        >
          <Flex.Col>
            <Typography.Div
              content="SUBTOTAL"
              size="bodyExtraSmall"
              fontWeight="semibold"
              color="ink50"
            />
            <Typography.Div>
              {/* TODO: do not hard code */}
              <AssetViewer.Ada.Standard
                as="span"
                lovelaceAmount={150000000}
                size="bodySmall"
                color="ink"
                fontWeight="semibold"
              />
              <Typography.Span content=" " />
              <AssetViewer.Ada.Standard
                as="span"
                lovelaceAmount={100000000}
                size="bodySmall"
                color="ink50"
                style={{ textDecoration: "line-through" }}
              />
            </Typography.Div>
          </Flex.Col>
          <Button.Solid
            content="Mint Collection"
            size="large"
            color="primary"
            onClick={handleSubmit}
          />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}
