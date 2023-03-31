import cx from "classnames";
import * as React from "react";

import ModalFreeMintKolour from "../../../PageKolours/containers/ModalFreeMintKolour";
import FreeKolourGrid from "../../components/FreeKolourGrid";
import IconGift from "../../icons/IconGift";

import { UseFreeKolour$Result } from "./hooks/useFreeKolour";
import styles from "./index.module.scss";

import { calculateKolourFee } from "@/modules/kolours/fees";
import { Kolour } from "@/modules/kolours/types/Kolours";
import { useModalPromises } from "@/modules/modal-promises";
import AssetViewer from "@/modules/teiki-ui/components/AssetViewer";
import Button from "@/modules/teiki-ui/components/Button";
import Divider from "@/modules/teiki-ui/components/Divider";
import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: Kolour[];
  freeKolourResponse?: UseFreeKolour$Result;
  onChange?: (newValue: Kolour[]) => void;
  fill?: boolean;
};

export default function PanelPickedKolours({
  className,
  style,
  value,
  freeKolourResponse,
  onChange,
  fill,
}: Props) {
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
    <div
      className={cx(styles.container, className, fill ? styles.fill : null)}
      style={style}
    >
      <Flex.Col className={styles.content} alignItems="stretch">
        <Flex.Row
          padding="24px"
          alignItems="center"
          justifyContent="space-between"
          flex="0 0 auto"
        >
          <Typography.Div content="Collection" size="heading6" />
          {freeKolourResponse?.error ||
          !freeKolourResponse?.data ||
          freeKolourResponse.data.used ===
            freeKolourResponse.data.total ? null : (
            <Flex.Row
              gap="8px"
              padding="8px 12px"
              alignItems="center"
              className={styles.remaining}
            >
              <IconGift />
              <Typography.Div
                content={`${
                  freeKolourResponse.data.total -
                  freeKolourResponse.data.used -
                  value.length
                }/${freeKolourResponse.data.total} Free Kolours Remaining`}
                size="bodyExtraSmall"
                color="white"
              />
            </Flex.Row>
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
              <AssetViewer.Ada.Standard
                as="span"
                //  All Free!
                lovelaceAmount={0}
                size="bodySmall"
                color="ink"
                fontWeight="semibold"
              />
              <Typography.Span content=" " />
              {value.length ? (
                <AssetViewer.Ada.Standard
                  as="span"
                  lovelaceAmount={value.reduce(
                    (prev, kolour) => prev + calculateKolourFee(kolour),
                    BigInt(0)
                  )}
                  size="bodySmall"
                  color="ink50"
                  style={{ textDecoration: "line-through" }}
                />
              ) : null}
            </Typography.Div>
          </Flex.Col>
          <Button.Solid
            content="Mint Collection"
            size="large"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !value.length ||
              !!freeKolourResponse?.error ||
              !freeKolourResponse?.data ||
              freeKolourResponse.data.total <
                freeKolourResponse.data.used + value.length
            }
          />
        </Flex.Row>
      </Flex.Col>
    </div>
  );
}
