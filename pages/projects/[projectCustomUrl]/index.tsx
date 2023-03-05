import { GetServerSideProps } from "next";
import { SWRConfig, unstable_serialize } from "swr";

import PageProjectDetails from "../../../containers/PageProjectDetails";

import { db } from "@/modules/next-backend/db";
import {
  getDetailedProject,
  GetDetailedProject$Params,
} from "@/modules/next-backend/logic/getDetailedProject";
import { httpGetProject$GetKey } from "@/modules/next-backend-client/api/httpGetProject";

type Props = {
  fallback: Record<string, unknown>;
  projectCustomUrl: string;
};

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails({
  fallback,
  projectCustomUrl,
}: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <PageProjectDetails
        projectCustomUrl={projectCustomUrl}
        projectId={undefined}
      />
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const customUrl = context.params?.["projectCustomUrl"];

  if (typeof customUrl !== "string" || !/^[ -~]+$/.test(customUrl)) {
    return { notFound: true };
  }

  const project$Params: GetDetailedProject$Params = {
    customUrl,
    projectId: undefined,
    preset: "full",
  };
  const project$Key = httpGetProject$GetKey(project$Params);
  const project$Response = await getDetailedProject(db, project$Params).catch(
    (error) => {
      console.error("[SSR | ProjectDetails | project]", error);
      return undefined;
    }
  );

  return {
    props: {
      fallback: {
        [unstable_serialize(project$Key)]: project$Response,
      },
      projectCustomUrl: customUrl,
    },
  };
};
