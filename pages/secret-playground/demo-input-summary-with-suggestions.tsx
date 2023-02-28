import { GetServerSideProps } from "next";
import * as React from "react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";
import InputSummaryWithSuggestions from "../../containers/PageEditProject/containers/ProjectBasicsEditor/containers/BasicForm/components/InputSummaryWithSuggestions";

import Resizable from "@/modules/teiki-components/components/Resizable";

export default function Demo() {
  const [value, setValue] = React.useState("");
  return (
    <article
      style={{ margin: "20px auto", padding: "20px", maxWidth: "800px" }}
    >
      <Resizable canResizeHeight style={{ margin: "auto", padding: "40px" }}>
        <InputSummaryWithSuggestions
          value={value}
          onChange={setValue}
          suggestions={[
            {
              key: "",
              value:
                "Teiki is a decentralized crowdfunding protocol initially built on Cardano and IPFS. We utilize Cardano’s liquid staking to build a novel subscription model, where backers stake ADA at Teiki Smart Contracts to generate rewards for project creators.",
            },
          ]}
        />
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
