import cx from "classnames";
import React from "react";

import Tier from "./containers/Tier";
import styles from "./index.module.scss";

import { ProjectBenefitsTier } from "@/modules/business-types";
import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Button from "@/modules/teiki-ui/components/Button";
import Flex from "@/modules/teiki-ui/components/Flex";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: ProjectBenefitsTier[];
  onClickBecomeMember?: () => void;
};

export default function PanelBenefits({
  className,
  style,
  value,
  onClickBecomeMember,
}: Props) {
  const [showAll, setShowAll] = React.useState(false);
  const [containerElement, setContainerElement] =
    React.useState<HTMLDivElement | null>(null);
  const containerSize = useElementSize(containerElement);
  const numVisibleItems = containerSize ? Math.ceil(containerSize.w / 600) : 1;
  const items = partition(value, numVisibleItems);

  return (
    <div
      className={cx(className, styles.container)}
      style={style}
      ref={setContainerElement}
    >
      <Flex.Col gap="12px" className={styles.box}>
        {(showAll ? items : [items[0]]).map((tiers, index) => (
          <Flex.Row className={styles.row} key={index}>
            {tiers.map((tier, index) => (
              <Tier
                value={tier}
                key={index}
                style={{
                  flex: "1 1",
                  minWidth: `${100 / numVisibleItems}%`,
                  maxWidth: `${100 / numVisibleItems}%`,
                }}
                onClickBecomeMember={onClickBecomeMember}
              />
            ))}
          </Flex.Row>
        ))}
        {showAll || items.length < 2 ? null : (
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

function partition(
  value: ProjectBenefitsTier[],
  length: number
): ProjectBenefitsTier[][] {
  const result: ProjectBenefitsTier[][] = [];
  let items = value;
  while (items.length) {
    result.push(items.slice(0, length));
    items = items.slice(length);
  }
  return result;
}
