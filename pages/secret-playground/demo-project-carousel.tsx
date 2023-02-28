import { GetServerSideProps } from "next";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";
import ProjectCarousel from "../../containers/PageHome/containers/ProjectCarousel";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateProjectGeneralInfo, generateSome } from "@/modules/data-faker";
import Resizable from "@/modules/teiki-components/components/Resizable";

export default function DemoProjectCarousel() {
  const projects = useComputationOnMount(() =>
    generateSome(generateProjectGeneralInfo)
  );
  if (!projects) return null;

  return (
    <article>
      <Resizable defaultWidth="1000px" style={{ margin: "auto" }}>
        <ProjectCarousel data={{ projects }} />
      </Resizable>
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};
