import cx from "classnames";
import * as React from "react";

import ModalFreeMintKolour from "../../../PageKolours/containers/ModalFreeMintKolour";
import { useQuoteFreeKolourNft$Nft } from "../../../PageKolours/containers/ModalFreeMintKolour/hooks/useQuoteFreeKolourNft";
import FreeKolourGrid from "../../components/FreeKolourGrid";

import { useFreeKolour } from "./hooks/useFreeKolour";
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
  onChange?: (newValue: Kolour[]) => void;
};

export default function PanelPickedKolours({
  className,
  style,
  value,
  onChange,
}: Props) {
  const { walletStatus } = useAppContextValue$Consumer();

  const freeKolour$Response = useFreeKolour({
    address:
      walletStatus.status === "connected" ? walletStatus.info.address : "",
  });

  // TODO: Delete this if not being used.
  const quoteResult = useQuoteFreeKolourNft$Nft({
    kolours: value,
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
          {freeKolour$Response?.error ||
          !freeKolour$Response?.data ||
          freeKolour$Response.data.used ===
            freeKolour$Response.data.total ? null : (
            <Typography.Div
              content={`${
                freeKolour$Response.data.total - freeKolour$Response.data.used
              }/${freeKolour$Response.data.total} Free Kolours Remaining`}
              size="bodyExtraSmall"
            />
          )}
        </Flex.Row>
        <Divider.Horizontal />
        <Flex.Col flex="1 1 200px" minHeight="0" className={styles.colorPanel}>
          <FreeKolourGrid
            value={value}
            onChange={(newValue: Kolour[]) => {
              return onChange && onChange(newValue);
            }}
            className={styles.colorGrid}
          />
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
