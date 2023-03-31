import { GetStaticProps } from "next";
import React from "react";

import PageControl from "../../containers/PageEditProject/containers/ProjectEditor/components/PageControl";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import Resizable from "@/modules/teiki-components/components/Resizable";

export default function DemoPageControl() {
  const [value, setValue] = React.useState<0 | 1 | 2 | 3>(0);
  return (
    <article>
      <Resizable
        canResizeHeight
        style={{
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "lightgray",
        }}
      >
        <PageControl
          value={value}
          onChange={setValue}
          progress={{
            description: 0.0,
            tiers: 0.0,
            basics: 0.333,
            community: 1.0,
          }}
        />
      </Resizable>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};
