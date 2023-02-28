import React from "react";
import { Form } from "semantic-ui-react";

import useBackgroundColor from "@/modules/common-hooks/hooks/useBackgroundColor";
import useComputationOnMount from "@/modules/common-hooks/hooks/useComputationOnMount";
import { generateProjectGeneralInfo } from "@/modules/data-faker";
import PanelProjectOverview from "@/modules/teiki-components/components/PanelProjectOverview";
import Resizable from "@/modules/teiki-components/components/Resizable";

function Select<T>({
  value,
  onChange,
  label,
  options,
}: {
  value: T;
  onChange: (newValue: T) => void;
  label: string;
  options: Record<string, T>;
}) {
  const getKeyOf = function <T>(obj: Record<string, T>, value: T) {
    for (const key in obj) {
      if (obj[key] === value) return key;
    }
    return undefined;
  };

  const [initialValue] = React.useState(value);
  return (
    <Form.Select
      value={getKeyOf(options, value)}
      label={label}
      options={Object.keys(options).map((k) => ({ value: k, text: k }))}
      onChange={(_, { value }) =>
        onChange(
          typeof value === "string" && value in options
            ? options[value]
            : initialValue
        )
      }
    />
  );
}

export default function Demo() {
  const value = useComputationOnMount(() => generateProjectGeneralInfo());
  const [showButtonBackProject, setShowButtonBackProject] =
    React.useState(true);
  const [showButtonUpdateProject, setShowButtonUpdateProject] =
    React.useState(false);
  const [showButtonShare, setShowButtonShare] = React.useState(true);
  const [showButtonPostUpdate, setShowButtonPostUpdate] = React.useState(false);
  const [showButtonCloseProject, setShowButtonCloseProject] =
    React.useState(false);
  useBackgroundColor("#D9EAE1");

  return (
    <article style={{ margin: "auto" }}>
      <Form
        style={{
          padding: "20px",
          margin: "20px",
          borderRadius: "16px",
          backgroundColor: "white",
        }}
      >
        <Form.Group
          style={{ display: "flex", maxWidth: "100%", flexWrap: "wrap" }}
        >
          <Select
            value={showButtonBackProject}
            onChange={setShowButtonBackProject}
            label="showButtonBackProject"
            options={{ false: false, true: true }}
          />
          <Select
            value={showButtonUpdateProject}
            onChange={setShowButtonUpdateProject}
            label="showButtonUpdateProject"
            options={{ false: false, true: true }}
          />
          <Select
            value={showButtonShare}
            onChange={setShowButtonShare}
            label="showButtonShare"
            options={{ false: false, true: true }}
          />
          <Select
            value={showButtonPostUpdate}
            onChange={setShowButtonPostUpdate}
            label="showButtonPostUpdate"
            options={{ false: false, true: true }}
          />
          <Select
            value={showButtonCloseProject}
            onChange={setShowButtonCloseProject}
            label="showButtonCloseProject"
            options={{ false: false, true: true }}
          />
        </Form.Group>
      </Form>
      <Resizable style={{ margin: "auto" }} defaultWidth="1328px">
        {value ? (
          <PanelProjectOverview
            basics={value.basics}
            history={value.history}
            categories={value.categories}
            stats={value.stats}
            community={value.community}
            options={{
              buttonBackProject: {
                visible: showButtonBackProject,
                disabled: false,
                onClick: () => alert("clicked: buttonBackProject"),
              },
              buttonUpdateProject: {
                visible: showButtonUpdateProject,
                disabled: false,
                onClick: () => alert("clicked: buttonUpdateProject"),
              },
              buttonShare: {
                visible: showButtonShare,
                disabled: false,
                onClick: () => alert("clicked: buttonShare"),
              },
              buttonPostUpdate: {
                visible: showButtonPostUpdate,
                disabled: false,
                onClick: () => alert("clicked: buttonPostUpdate"),
              },
              buttonCloseProject: {
                visible: showButtonCloseProject,
                disabled: false,
                onClick: () => alert("clicked: buttonCloseProject"),
              },
            }}
          />
        ) : null}
      </Resizable>
    </article>
  );
}
