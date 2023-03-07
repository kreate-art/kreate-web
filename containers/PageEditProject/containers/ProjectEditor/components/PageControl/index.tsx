import cx from "classnames";

import { ProjectProgressScores, TabIndex } from "../../../../types";
import TabControl from "../TabControl";

import IconInfo from "./icons/IconInfo";
import IconTeamwork from "./icons/IconTeamwork";
import IconWrite from "./icons/IconWrite";
import styles from "./index.module.scss";

import Divider from "@/modules/teiki-ui/components/Divider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: TabIndex; // which tab is active
  progress: ProjectProgressScores;
  onChange?: (value: TabIndex) => void;
};

/**
 * `PageControl` receives a `value: 0 | 1 | 2 | 3`,
 * shows a page control with 4 tabs,
 * triggers `onChange(newValue: 0 | 1 | 2 | 3)` when user switch to another tab.
 */
export default function PageControl({
  className,
  style,
  value,
  progress,
  onChange,
}: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      <TabControl
        className={styles.tab}
        active={value === 0}
        label="Campaign"
        icon={<IconWrite />}
        progressScore={progress.description}
        onClick={() => onChange && onChange(0)}
      />
      <Divider.Vertical color="black-05" />
      <TabControl
        className={styles.tab}
        active={value === 1}
        label="Basics"
        icon={<IconInfo />}
        progressScore={progress.basics}
        onClick={() => onChange && onChange(1)}
      />
      <Divider.Vertical color="black-05" />
      {/* <TabControl
        className={styles.tab}
        active={value === 2}
        label="Roadmap"
        icon={<IconRoadmap />}
        progressScore={progress.roadmap}
        onClick={() => onChange && onChange(2)}
      />
      <Divider.Vertical color="black-05" /> */}
      <TabControl
        className={styles.tab}
        active={value === 3}
        label="Community"
        icon={<IconTeamwork />}
        progressScore={progress.community}
        onClick={() => onChange && onChange(3)}
      />
    </div>
  );
}
