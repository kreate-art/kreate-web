// This component is simmilar to
// PageEditProject/containers/ModalGroup$CreateProject/components/ModalSubmit
import cx from "classnames";
import moment from "moment";
import React from "react";

import InputLovelaceAmount$Sponsor from "../../../PageEditProject/containers/ModalGroup$CreateProject/components/ModalSubmit/components/InputLovelaceAmount$Sponsor";
import { useCreateProjectLogic } from "../../../PageEditProject/containers/ModalGroup$CreateProject/hooks/useCreateProjectLogic";
import ErrorBox from "../../components/ErrorBox";
import { TxBreakdown, useEstimatedFees } from "../../hooks/useEstimatedFees";
import IconClock from "../ModalUpdateProject/icons/IconClock";

import styles from "./index.module.scss";

import { ResultT } from "@/modules/async-utils";
import {
  formatLovelaceAmount,
  sumLovelaceAmount,
} from "@/modules/bigint-utils";
import {
  LovelaceAmount,
  Project,
  ProjectAnnouncement,
  UnixTimestamp,
} from "@/modules/business-types";
import { DisplayableError } from "@/modules/displayable-error";
import { useTxParams$CreatorUpdateProject } from "@/modules/next-backend-client/hooks/useTxParams$CreatorUpdateProject";
import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";
import Modal from "@/modules/teiki-ui/components/Modal";
import Typography from "@/modules/teiki-ui/components/Typography";

type SuccessEvent = {
  sponsorshipAmount: LovelaceAmount;
};

export type ModalSponsorship$SuccessEvent = SuccessEvent;

type Props = {
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  projectId: string;
  currentSponsorship?: LovelaceAmount;
  sponsoredUntil?: UnixTimestamp;
  project: Project;
  announcement: ProjectAnnouncement;
  onCancel?: () => void;
  onSuccess?: (event: SuccessEvent) => void;
};

export default function ModalSponsorship({
  className,
  style,
  open,
  projectId,
  currentSponsorship,
  sponsoredUntil,
  project,
  announcement,
  onCancel,
  onSuccess,
}: Props) {
  const [sponsorInputOpen, setSponsorInputOpen] = React.useState(false);
  const txParamsResult = useTxParams$CreatorUpdateProject({ projectId });
  const { input, syntaxError, output } = useCreateProjectLogic({
    projectSponsorshipMinFee:
      txParamsResult?.error == null
        ? txParamsResult?.computed.protocolParams.projectSponsorshipMinFee
        : undefined,
  });
  const [txBreakdown$ResultT, setTxBreakdown$ResultT] = React.useState<
    ResultT<TxBreakdown> | undefined
  >(undefined);

  const txBreakdownResultT$New = useEstimatedFees({
    projectId,
    newSponsorshipAmount: output.lovelaceAmount,
    shouldPostAnnouncement: false,
    disabled: !!syntaxError.lovelaceAmount || !output.lovelaceAmount,
    project,
    announcement,
  });

  const isTxBreakdownLoading = !txBreakdownResultT$New;

  React.useEffect(() => {
    setTxBreakdown$ResultT(txBreakdownResultT$New);
  }, [txBreakdownResultT$New]);

  const txBreakdown: TxBreakdown | undefined = txBreakdown$ResultT?.ok
    ? txBreakdown$ResultT.result
    : undefined;

  const txBreakdown$DisplableError =
    txBreakdown$ResultT?.ok === false
      ? DisplayableError.from(txBreakdown$ResultT.reason)
      : undefined;

  return (
    <Modal
      className={cx(styles.container, className)}
      style={style}
      open={open}
      onOpenChange={(open) => !open && onCancel && onCancel()}
      closeOnDimmerClick={false}
      closeOnEscape={true}
    >
      <Modal.Header content="Sponsorship" />
      <Modal.Content padding="none" className={styles.modalContent}>
        <Flex.Row alignItems="stretch" flexWrap="wrap">
          <Flex.Col flex="10000 10000 294px" padding="32px 48px" gap="24px">
            <Typography.Div content="Sponsorship Status" size="heading6" />
            <Flex.Col className={styles.sponsorBox}>
              <Flex.Col gap="20px">
                <Flex.Row justifyContent="space-between">
                  <Flex.Row gap="4px" alignItems="center">
                    <Typography.Span
                      content={`(${formatLovelaceAmount(
                        currentSponsorship ?? 0,
                        { compact: true }
                      )} ₳ / month)`}
                      size="heading6"
                      color="ink80"
                    />
                  </Flex.Row>
                  <Flex.Row alignItems="center" gap="8px">
                    <IconClock />
                    <Typography.Div
                      content={
                        sponsoredUntil == null
                          ? "-"
                          : moment().isAfter(sponsoredUntil)
                          ? `Expired`
                          : `Expires ${moment(sponsoredUntil).fromNow()}`
                      }
                      size="heading6"
                      color="green"
                    />
                  </Flex.Row>
                </Flex.Row>
              </Flex.Col>
            </Flex.Col>
            <Typography.Div content="Extends" size="heading6" />
            <InputLovelaceAmount$Sponsor
              open={sponsorInputOpen}
              value={input.lovelaceAmount}
              projectId={projectId}
              onChange={input.setLovelaceAmount}
              onBlur={() => setSponsorInputOpen(false)}
              onFocus={() => setSponsorInputOpen(true)}
              inlineError={syntaxError.lovelaceAmount}
              lovelaceAmount={output.lovelaceAmount}
            />
          </Flex.Col>
          <Flex.Row flex="1 1 294px" alignItems="stretch">
            <PanelFeesBreakdown
              style={{ flex: "1 1 auto" }}
              title="Transaction Breakdown"
              rows={[
                {
                  label: "Remaining",
                  value:
                    output?.lovelaceAmount != null &&
                    txBreakdown?.extendsSponsorship != null
                      ? sumLovelaceAmount([
                          output.lovelaceAmount,
                          txBreakdown.extendsSponsorship,
                        ])
                      : undefined,
                },
                {
                  label: "New Plan",
                  value:
                    output?.lovelaceAmount != null
                      ? -output.lovelaceAmount
                      : undefined,
                },
              ]}
              total={txBreakdown?.extendsSponsorship}
              bottomSlot={
                <div>
                  {txBreakdown$DisplableError ? (
                    <ErrorBox
                      style={{ marginTop: "16px" }}
                      title={txBreakdown$DisplableError.title}
                      description={txBreakdown$DisplableError.description}
                      tooltip={txBreakdown$DisplableError.description}
                    />
                  ) : null}
                </div>
              }
              loading={isTxBreakdownLoading}
            />
          </Flex.Row>
        </Flex.Row>
      </Modal.Content>
      <Modal.Actions>
        <Button.Outline content="Cancel" onClick={onCancel} />
        <Button.Solid
          content="Apply"
          onClick={() =>
            onSuccess &&
            onSuccess({ sponsorshipAmount: output.lovelaceAmount ?? 0 })
          }
          disabled={!output.lovelaceAmount}
        />
      </Modal.Actions>
    </Modal>
  );
}
