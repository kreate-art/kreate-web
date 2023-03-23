import cx from "classnames";
import { PieChart } from "react-minimal-pie-chart";

import { PaletteItem } from "../../kolours-types";

import styles from "./index.module.scss";

import Flex from "@/modules/teiki-ui/components/Flex";
import Typography from "@/modules/teiki-ui/components/Typography";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  value: PaletteItem[];
};

export default function CompleteIndicator({ className, style, value }: Props) {
  const resolvedCount = value.filter((item) => item.status !== "free").length;
  const pieChartData = [
    { value: resolvedCount, color: "#006e46" },
    { value: value.length - resolvedCount, color: "rgba(34, 34, 34, .1)" },
  ];

  return (
    <div className={cx(styles.container, className)} style={style}>
      <PieChart
        data={pieChartData}
        lineWidth={60}
        labelPosition={70}
        labelStyle={{
          fill: "#fff",
          opacity: 0.75,
          pointerEvents: "none",
          fontSize: "6px",
        }}
        startAngle={-90}
      />
      <Flex.Col
        className={styles.percentage}
        justifyContent="center"
        alignItems="center"
      >
        <Typography.Div
          content={`${Math.round((resolvedCount * 100) / value.length)}%`}
          size="bodyExtraSmall"
          fontWeight="semibold"
          color="ink80"
        />
      </Flex.Col>
    </div>
  );
}
