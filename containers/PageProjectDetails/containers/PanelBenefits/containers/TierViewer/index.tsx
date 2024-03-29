import cx from "classnames";

import Tier from "./containers/Tier";
import styles from "./index.module.scss";

import { LovelaceAmount, ProjectBenefitsTier } from "@/modules/business-types";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: (ProjectBenefitsTier & { activeMemberCount?: number })[];
  currentTier: (ProjectBenefitsTier & { activeMemberCount?: number }) | null;
  stakingAmount?: LovelaceAmount;
  numColumn: number;
  isUserCreator?: boolean;
  onClickBecomeMember?: (initialAmount?: LovelaceAmount) => void;
  onClickDowngrade?: (initialAmount?: LovelaceAmount) => void;
};

export default function TierViewer({
  className,
  style,
  value,
  currentTier,
  numColumn,
  stakingAmount,
  isUserCreator,
  onClickBecomeMember,
  onClickDowngrade,
}: Props) {
  const numRow = Math.ceil(value.length / numColumn);

  return (
    <div
      className={cx(className, styles.container)}
      style={{
        gridTemplateColumns: `repeat(${numColumn}, 1fr)`,
        ...style,
      }}
    >
      {value.map((item, index) => (
        <>
          <Tier
            value={item}
            currentTier={currentTier}
            stakingAmount={stakingAmount}
            isUserCreator={isUserCreator}
            onClickBecomeMember={onClickBecomeMember}
            onClickDowngrade={onClickDowngrade}
            className={cx(
              styles.tier,
              // top-left: the first item
              index === 0 ? styles.topLeft : null,
              // top-right: the last item of the first row
              index < numColumn &&
                index + 1 === Math.min(value.length, numColumn)
                ? styles.topRight
                : null,
              // bottom-left: the first item of the last row
              Math.ceil((index + 1) / numColumn) === numRow &&
                index % numColumn === 0
                ? styles.bottomLeft
                : null,
              // bottom-right: the last item or the last items of the second last row
              // if the last row is not fully filled
              index + 1 === value.length ||
                (Math.ceil((index + 1) / numColumn) + 1 === numRow &&
                  (index - numColumn + 1) % numColumn === 0 &&
                  value.length % numColumn !== 0)
                ? styles.bottomRight
                : null
            )}
          />
        </>
      ))}
    </div>
  );
}
