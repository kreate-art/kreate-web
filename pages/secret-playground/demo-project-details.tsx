import { GetServerSideProps } from "next";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";
import PageProjectDetails from "../../containers/PageProjectDetails";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateDetailedProject } from "@/modules/data-faker";

export default function PageDemoProjectDetails() {
  const project = useComputationOnMount(() => generateDetailedProject());
  if (!project) return null;
  /**NOTE: @sk-tenba: this page is currently unavailable because it no longer
   * receive data from getStaticProps
   */
  return <PageProjectDetails project={project} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};
