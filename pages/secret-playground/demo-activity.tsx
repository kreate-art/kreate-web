import { GetStaticProps } from "next";

import PanelActivities from "../../containers/PageProjectDetails/containers/PanelActivities";
import Activity from "../../containers/PageProjectDetails/containers/ProjectDetails/containers/TabActivities/components/Activity";
import ActivityList from "../../containers/PageProjectDetails/containers/ProjectDetails/containers/TabActivities/components/ActivityList";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import {
  generateProjectActivity,
  generateProjectActivityList,
} from "@/modules/data-faker";
import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import Resizable from "@/modules/teiki-components/components/Resizable";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";

export default function PageDemoActivity() {
  const projectActivity = useComputationOnMount(() =>
    generateProjectActivity()
  );

  const projectActivityList = useComputationOnMount(() =>
    generateProjectActivityList()
  );

  if (!projectActivity) return null;
  if (!projectActivityList) return null;

  return (
    <>
      <TeikiHead />
      <div>
        <h3>PanelActivities</h3>
        <Resizable defaultWidth="317px" style={{ padding: "20px" }}>
          <PanelActivities
            value={projectActivityList}
            id="all_activities_button"
          />
        </Resizable>
        <h3>Activity</h3>
        <Resizable defaultWidth="850px" style={{ padding: "20px" }}>
          <Activity value={projectActivity} />
        </Resizable>
        <h3>ActivityList</h3>
        <Resizable defaultWidth="850px" style={{ padding: "20px" }}>
          <ActivityList value={projectActivityList} />
        </Resizable>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};
