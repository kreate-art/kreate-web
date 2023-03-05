import { GetServerSideProps } from "next";

import PageProjectDetails from "../../../containers/PageProjectDetails";

type Props = {
  projectCustomUrl: string;
};

// eslint-disable-next-line react/prop-types
export default function RouteToPageProjectDetails({ projectCustomUrl }: Props) {
  return (
    <PageProjectDetails
      projectCustomUrl={projectCustomUrl}
      projectId={undefined}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const customUrl = context.params?.["projectCustomUrl"];

  if (typeof customUrl !== "string" || !/^[ -~]+$/.test(customUrl)) {
    return { notFound: true };
  }

  // TODO: if project is not found, show page 404
  return {
    props: {
      projectCustomUrl: customUrl,
    },
  };
};
