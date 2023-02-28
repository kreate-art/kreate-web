import * as React from "react";

import PanelProtocolReward from "../../containers/PageProjectDetails/containers/PanelProtocolReward";
import ModalClaimSuccess from "../../containers/PageProjectDetails/containers/PanelProtocolReward/containers/ModalClaimSuccess";

import { useModalPromises } from "@/modules/modal-promises";
import Resizable from "@/modules/teiki-components/components/Resizable";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const { showModal } = useModalPromises();

  return (
    <article style={{ margin: "20px auto", textAlign: "center" }}>
      <div>
        <Button.Solid
          content="Show ModalClaimSuccess"
          onClick={() => {
            showModal<void>((resolve) => (
              <ModalClaimSuccess
                open
                onClose={() => resolve()}
                projectTitle="Teiki"
                txHash="c011c292b6dbccdf3ca9166228d5c0db7a344255ebe9f3fa70ab121e513a3c45"
              />
            ));
          }}
        />
      </div>
      <Resizable
        style={{ margin: "20px auto" }}
        defaultWidth="317px"
        canResizeHeight
      >
        <PanelProtocolReward
          style={{ height: "100%" }}
          backerAddress="addr_test1qp8pgqk4030rj4rw90jmdsnlvmyn8763detwvxxvu64533t4yf8aclpegc8huyptlj4l5tsz6yap8e72m7pnq8zz3fss9ts5lj"
          projectId="efb964b8c8c57fef214fe8187b11f49587abddb7678318079c2a81ad48f929ea"
          projectTitle="Teiki"
        />
      </Resizable>
    </article>
  );
}
