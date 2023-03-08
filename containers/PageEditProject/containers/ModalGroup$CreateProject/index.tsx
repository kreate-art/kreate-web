import { useRouter } from "next/router";
import * as React from "react";

import ModalSubmit from "./components/ModalSubmit";
import ModalSuccess from "./components/ModalSuccess";

import { Project } from "@/modules/business-types";

type Step = "submit" | "success";

type Props = {
  open: boolean;
  project: Project | null;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function ModalGroup$CreateProject({
  open,
  project,
  onCancel,
}: Props) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("submit");
  const [key, setKey] = React.useState(0); // auto-increasing key

  if (open && !project) {
    console.warn("cannot show modal due to insufficient inputs");
  }

  if (!open || !project) return null;

  return (
    <React.Fragment key={key}>
      <ModalSubmit
        open={step === "submit"}
        project={project}
        onCancel={() => {
          setKey((key) => key + 1); // reset the form
          setStep("submit");
          onCancel && onCancel();
        }}
        onSuccess={() => setStep("success")}
      />
      <ModalSuccess
        open={step === "success"}
        onClose={() => router.push(`/c/${project.basics.customUrl}`)}
      />
    </React.Fragment>
  );
}
