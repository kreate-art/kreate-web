import cx from "classnames";
import React from "react";

import { ProgressScore } from "../../../../types";
import { ProgressScoreIndicator } from "../ProgressScoreIndicator";

import styles from "./index.module.scss";

import { useElementSize } from "@/modules/common-hooks/hooks/useElementSize";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  active: boolean;
  label: string;
  icon: JSX.Element;
  progressScore: ProgressScore;
  onClick?: () => void;
};

export default function TabControl({
  className,
  style,
  active,
  label,
  icon,
  progressScore,
  onClick,
}: Props) {
  const [buttonElement, setButtonElement] =
    React.useState<HTMLButtonElement | null>(null);
  const buttonSize = useElementSize(buttonElement);
  const hideIcon = buttonSize && buttonSize.w < 200;
  const hideProgressScoreIndicator = buttonSize && buttonSize.w < 120;

  return (
    <button
      ref={setButtonElement}
      className={cx(className, styles.container, active ? styles.active : null)}
      style={style}
      onClick={onClick}
      title={label}
    >
      <div className={cx(styles.icon, hideIcon ? styles.hidden : null)}>
        {icon}
      </div>
      <Title className={styles.title} size="h6" content={label} />
      <ProgressScoreIndicator
        className={cx(
          styles.progressScoreIndicator,
          hideProgressScoreIndicator ? styles.hidden : null
        )}
        value={progressScore}
      />
    </button>
  );
}
