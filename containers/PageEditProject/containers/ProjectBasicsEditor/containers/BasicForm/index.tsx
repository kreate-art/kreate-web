import * as React from "react";

import GrammarlyWrapper from "../../../../../../components/GrammarlyWrapper";
import { useCheckCustomUrlExists } from "../../../ProjectEditor/hooks/useCheckCustomUrlExists";

import InputSummaryWithSuggestions from "./components/InputSummaryWithSuggestions";
import InputTagsWithSuggestions from "./components/InputTagsWithSuggestions";
import styles from "./index.module.scss";

import { ProjectBasics } from "@/modules/business-types";
import ComboBox from "@/modules/teiki-ui/components/ComboBox";
import Title from "@/modules/teiki-ui/components/Title";

type Props = {
  value: ProjectBasics;
  onChange?: (value: ProjectBasics) => void;
  projectId: string | null; // projectId != null in flow creator-update-project
  suggestedTags: string[] | null;
  suggestedSlogans: string[] | null;
  suggestedTitles: string[] | null;
  suggestedSummary: string | null;
  suggestedCustomUrls: string[] | null;
};

export default function BasicForm({
  value,
  onChange,
  projectId,
  suggestedTags,
  suggestedSlogans,
  suggestedTitles,
  suggestedSummary,
  suggestedCustomUrls,
}: Props) {
  const checkCustomUrlExists$Result = useCheckCustomUrlExists({
    customUrl: value.customUrl ?? "",
    ignoreIfProjectIdIs: projectId,
  });

  return (
    <div className={styles.basicForm}>
      <div className={styles.basicTitle}>
        <ComboBox.Text
          value={value.title}
          onChange={(title) => onChange && onChange({ ...value, title })}
          suggestions={(suggestedTitles || []).map((item) => ({
            key: item,
            value: item,
          }))}
          label="Name"
          placeholder="Give your project a name"
          zIndex={1}
        />
      </div>
      <div className={styles.basicInputWrapper}>
        <ComboBox.Text
          value={value.slogan}
          onChange={(slogan) => onChange && onChange({ ...value, slogan })}
          suggestions={(suggestedSlogans || []).map((item) => ({
            key: item,
            value: item,
          }))}
          label="Tagline"
          placeholder="Give your project a tagline"
          zIndex={1}
        />
      </div>
      <div className={styles.basicInputWrapper}>
        <ComboBox.Text
          value={value.customUrl ?? ""}
          onChange={(customUrl) =>
            onChange &&
            onChange({
              ...value,
              customUrl: customUrl.replace(/[^a-zA-Z0-9_-]+/g, ""),
            })
          }
          suggestions={(suggestedCustomUrls || []).map((item) => ({
            key: item,
            value: item,
          }))}
          label="Custom URL"
          placeholder="project-title"
          leftSlot={
            <div className={styles.customUrlLeftSlot}>
              <Title content="teiki.network/p/" />
            </div>
          }
          paddingLeft="narrow"
          zIndex={1}
        />
        {checkCustomUrlExists$Result?.exists ? (
          <Title content="Custom URL already existed" color="red" />
        ) : null}
      </div>
      <div className={styles.basicInputWrapper}>
        <Title className={styles.label} content="Tags" />
        <InputTagsWithSuggestions
          tags={value.tags}
          suggestions={suggestedTags || []}
          onChange={(newTags) => {
            // TODO: should re-generate illustration suggestions
            onChange && onChange({ ...value, tags: newTags });
          }}
        />
      </div>
      <div className={styles.basicInputWrapper}>
        <Title className={styles.label} content="Summary" />
        <GrammarlyWrapper>
          <InputSummaryWithSuggestions
            value={value.summary}
            onChange={(summary) => {
              onChange && onChange({ ...value, summary });
            }}
            suggestions={
              suggestedSummary ? [{ key: "", value: suggestedSummary }] : []
            }
          />
        </GrammarlyWrapper>
      </div>
    </div>
  );
}
