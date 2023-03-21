import cx from "classnames";
import React from "react";

import TierViewer from "./containers/TierViewer";
import styles from "./index.module.scss";

import { LovelaceAmount, ProjectBenefitsTier } from "@/modules/business-types";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: (ProjectBenefitsTier & { activeMemberCount?: number })[];
  stakingAmount?: LovelaceAmount;
  isUserCreator?: boolean;
  onClickBecomeMember?: (initialAmount?: LovelaceAmount) => void;
};

export default function PanelBenefits({
  className,
  style,
  value,
  stakingAmount,
  isUserCreator,
  onClickBecomeMember,
}: Props) {
  const [showAll, setShowAll] = React.useState(false);
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const numVisibleItems = containerSize ? Math.ceil(containerSize.w / 600) : 1;

  return (
    <div
      className={cx(className, styles.container)}
      style={style}
      ref={setContainerElement}
    >
      <Flex.Col gap="12px" className={styles.box}>
        <TierViewer
          value={showAll ? value : value.slice(0, numVisibleItems)}
          stakingAmount={stakingAmount}
          numColumn={numVisibleItems}
          isUserCreator={isUserCreator}
          onClickBecomeMember={onClickBecomeMember}
        />
        {showAll || value.length <= numVisibleItems ? null : (
          <Button.Link
            content={`See All ${value.length} tiers`}
            onClick={() => setShowAll(true)}
            style={{ textDecorationLine: "underline" }}
          />
        )}
      </Flex.Col>
    </div>
  );
}
