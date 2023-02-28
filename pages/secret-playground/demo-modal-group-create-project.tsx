import React from "react";

import ModalGroup$CreateProject from "../../containers/PageEditProject/containers/ModalGroup$CreateProject";

import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateProject } from "@/modules/data-faker";
import Button from "@/modules/teiki-ui/components/Button";

export default function Demo() {
  const [open, setOpen] = React.useState(false);
  const project = useComputationOnMount(() => generateProject());
  return (
    <article>
      <form onSubmit={(e) => e.preventDefault()}>
        <Button.Solid content="Show Modal" onClick={() => setOpen(true)} />
      </form>
      <ModalGroup$CreateProject
        open={open}
        project={project}
        onCancel={() => setOpen(false)}
        onSuccess={() => setOpen(false)}
      />
    </article>
  );
}
