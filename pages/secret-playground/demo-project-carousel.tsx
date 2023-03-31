import { GetStaticProps } from "next";

import ProjectCarousel from "../../containers/PageHome/containers/ProjectCarousel";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateProjectGeneralInfo, generateSome } from "@/modules/data-faker";
import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
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

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};
