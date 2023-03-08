import { GetServerSideProps } from "next";

export default function RouteToPagePreviewProject() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const projectId = context.query["projectId"];

  if (typeof projectId !== "string" || !/^[0-9A-Fa-f]*$/.test(projectId)) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: true,
      destination: `/c-by-id/${projectId}/preview`,
    },
  };
};
