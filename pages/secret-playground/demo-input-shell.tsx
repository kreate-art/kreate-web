import { GetStaticProps } from "next";

import { SHOW_SECRET_ROUTES } from "@/modules/env/client";
import Resizable from "@/modules/teiki-components/components/Resizable";
import InputShell from "@/modules/teiki-ui/components/InputShell";

function EmptyDiv({ backgroundColor }: { backgroundColor: string }) {
  return (
    <div
      style={{
        minWidth: "10px",
        minHeight: "10px",
        backgroundColor,
      }}
    />
  );
}

export default function DemoInputShell() {
  return (
    <article
      style={{ margin: "20px auto", padding: "20px", maxWidth: "800px" }}
    >
      <Resizable canResizeHeight style={{ margin: "auto", padding: "40px" }}>
        <InputShell
          style={{ width: "100%" }}
          topSlot={
            <>
              <EmptyDiv backgroundColor="hsl(0.1rad, 80%, 80%)" />
              <EmptyDiv backgroundColor="hsl(0.2rad, 80%, 80%)" />
            </>
          }
          leftSlot={
            <>
              <EmptyDiv backgroundColor="hsl(0.3rad, 80%, 80%)" />
              <EmptyDiv backgroundColor="hsl(0.4rad, 80%, 80%)" />
            </>
          }
          rightSlot={
            <>
              <EmptyDiv backgroundColor="hsl(0.5rad, 80%, 80%)" />
              <EmptyDiv backgroundColor="hsl(0.6rad, 80%, 80%)" />
            </>
          }
          bottomSlot={
            <>
              <EmptyDiv backgroundColor="hsl(0.7rad, 80%, 80%)" />
              <EmptyDiv backgroundColor="hsl(0.8rad, 80%, 80%)" />
            </>
          }
        >
          <input
            style={{
              padding: "16px 24px",
              outline: "none",
              border: "none",
              flex: "1 1 0",
              minWidth: "0",
              width: "0",
            }}
          />
        </InputShell>
      </Resizable>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return SHOW_SECRET_ROUTES ? { props: {} } : { notFound: true };
};
