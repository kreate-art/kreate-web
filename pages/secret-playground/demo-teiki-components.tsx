import { GetServerSideProps } from "next";

import { NEXT_PUBLIC_SHOW_SECRET_ROUTES } from "../../config/client";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateAddress, generateLovelaceAmount } from "@/modules/data-faker";
import Resizable from "@/modules/teiki-components/components/Resizable";
import TableTopSupporters from "@/modules/teiki-components/components/TableTopSupporters";
import TeikiHead from "@/modules/teiki-components/components/TeikiHead";

export default function PageDemoTeikiComponents() {
  const topSupporters = useComputationOnMount(() =>
    Array.from(Array(10), () => ({
      address: generateAddress(),
      lovelaceAmount: generateLovelaceAmount(),
    }))
  );

  if (!topSupporters) return null;

  return (
    <>
      <TeikiHead />
      <div>
        <h3>TableTopSupporters</h3>
        <Resizable defaultWidth="276px">
          <TableTopSupporters value={topSupporters} />
        </Resizable>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (NEXT_PUBLIC_SHOW_SECRET_ROUTES !== "true") {
    return { notFound: true };
  }
  return { props: {} };
};
