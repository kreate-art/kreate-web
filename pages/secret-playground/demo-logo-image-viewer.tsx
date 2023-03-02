import * as React from "react";

import { ProjectImage } from "@/modules/business-types";
import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateProjectBasics } from "@/modules/data-faker";
import LogoImageViewer from "@/modules/teiki-components/components/LogoImageViewer";
import Resizable from "@/modules/teiki-components/components/Resizable";

type SelectForm$Props<D> = {
  options: { [P in keyof D]: Record<string, D[P]> };
  formData: D;
  onFormDataChange?: (formData: D) => void;
};

function SelectForm<D>({
  options,
  formData,
  onFormDataChange,
}: SelectForm$Props<D>) {
  const labelOf = (key: keyof D) => (value: unknown) => {
    for (const [label, labeledValue] of Object.entries(options[key])) {
      if (value === labeledValue) return label;
    }
    return undefined;
  };

  return (
    <div>
      {(Object.keys(options) as (keyof D & string)[]).map((key) => (
        <fieldset style={{ display: "inline-block" }} key={key}>
          <label>{key}</label>
          <select
            value={labelOf(key)(formData[key])}
            onChange={(event) => {
              const value = event.target.value;
              const labeledValue = options[key as keyof D][value];
              onFormDataChange &&
                onFormDataChange({ ...formData, [key]: labeledValue });
            }}
          >
            {Object.keys(options[key]).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </fieldset>
      ))}
    </div>
  );
}

type FormData = {
  size: "small" | "medium";
  shadow: "shadow" | "none";
  border: "medium" | "none";
};

function applyProxy(projectImage: ProjectImage): ProjectImage {
  const originalUrl = projectImage.url;
  const url = `/_proxy?${new URLSearchParams({ url: originalUrl })}`;
  return { ...projectImage, url };
}

//
export default function Demo() {
  const logoImage = useComputationOnMount(
    () => generateProjectBasics()["logoImage"]
  );
  const [formData, setFormData] = React.useState<FormData>({
    size: "medium",
    shadow: "shadow",
    border: "medium",
  });

  return (
    <article style={{ margin: "20px auto", maxWidth: "800px" }}>
      <SelectForm
        options={{
          size: { medium: "medium", small: "small" },
          shadow: { shadow: "shadow", none: "none" },
          border: { medium: "medium", none: "none" },
        }}
        formData={formData}
        onFormDataChange={setFormData}
      />

      <Resizable style={{ margin: "20px 0", padding: "20px" }}>
        <LogoImageViewer
          value={logoImage ? applyProxy(logoImage) : undefined}
          size={formData.size}
          shadow={formData.shadow}
          border={formData.border}
        />
      </Resizable>
    </article>
  );
}
