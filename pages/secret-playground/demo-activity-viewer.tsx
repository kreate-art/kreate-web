import React from "react";

import ActivityViewer from "../../containers/PageProfile/containers/PanelActivities/components/ActivityViewer";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import {
  generateProjectActivity,
  generateProjectBasics,
} from "@/modules/data-faker";
import Resizable from "@/modules/teiki-components/components/Resizable";

export default function Demo() {
  const projectBasics = useComputationOnMount(() => generateProjectBasics());
  const projectActivity = useComputationOnMount(() =>
    generateProjectActivity()
  );

  if (!projectBasics || !projectActivity) return null;

  return (
    <article>
      <Resizable>
        <ActivityViewer
          projectBasics={projectBasics}
          projectActivity={projectActivity}
        />
      </Resizable>
    </article>
  );
}
