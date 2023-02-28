import * as React from "react";

import PanelFeesBreakdown from "@/modules/teiki-components/components/PanelFeesBreakdown";
import Resizable from "@/modules/teiki-components/components/Resizable";

export default function DemoFeesBreakdown() {
  return (
    <Resizable canResizeHeight>
      <PanelFeesBreakdown
        style={{ height: "100%" }}
        rows={[
          { label: "Project creation", value: 5000000 },
          { label: "Pledge", value: 5000000 },
          { label: "Project update" },
        ]}
        title={"Fees (breakdown)"}
        total={20000000}
        adaPriceInUsd={0.4}
      />
    </Resizable>
  );
}
