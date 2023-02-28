import { GetServerSideProps } from "next";
import React from "react";
import { Form } from "semantic-ui-react";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";
import PanelContributedAmount from "../../containers/PageProjectDetails/containers/PanelContributedAmount";

import Resizable from "@/modules/teiki-components/components/Resizable";

export default function DemoProjectComponents() {
  const [lovelaceAmountText, setLovelaceAmountText] = React.useState("");
  const lovelaceAmount = /^[0-9]+$/.test(lovelaceAmountText)
    ? BigInt(lovelaceAmountText)
    : undefined;
  return (
    <article style={{ margin: "auto", maxWidth: "800px" }}>
      <Form style={{ margin: "20px", padding: "20px" }}>
        <Form.Input
          label="Lovelace Amount"
          value={lovelaceAmountText}
          onChange={(e) => setLovelaceAmountText(e.target.value)}
        />
      </Form>
      <Resizable defaultWidth="317px" style={{ margin: "auto" }}>
        <PanelContributedAmount lovelaceAmount={lovelaceAmount} />
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
