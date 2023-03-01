import React from "react";

import BasicForm from "./containers/BasicForm";
import BasicMedia from "./containers/BasicMedia";
import styles from "./index.module.scss";

import { ProjectBasics, ProjectImage } from "@/modules/business-types";

type BlobUrl = string;

type Props = {
  value: ProjectBasics;
  onChange?: (value: ProjectBasics) => void;
  projectId: string | null; // projectId != null in flow creator-update-project
  suggestedTags: string[] | null;
  suggestedCoverImages: BlobUrl[] | null;
  suggestedSlogans: string[] | null;
  suggestedTitles: string[] | null;
  suggestedSummary: string | null;
  suggestedLogoImages: BlobUrl[] | null;
  suggestedCustomUrls: string[] | null;
};

/**
 * `ProjectBasicsEditor` is the editor of `ProjectBasics`.
 *
 * It receives `value: ProjectBasics`,
 * triggers `onChange(newValue)` on every change.
 */

export default function ProjectBasicsEditor({
  value,
  onChange,
  projectId,
  suggestedTags,
  suggestedCoverImages,
  suggestedSlogans,
  suggestedTitles,
  suggestedSummary,
  suggestedLogoImages,
  suggestedCustomUrls,
}: Props) {
  // TODO: @sk-kitsune: let the child component converts `blobUrl` to `ProjectImage`
  const coverSuggestions: ProjectImage[] = (suggestedCoverImages || []).map(
    (blobUrl) => ({ url: blobUrl, crop: { x: 0, y: 0, w: 1, h: 1 } })
  );

  // TODO: @sk-kitsune: let the child component converts `blobUrl` to `ProjectImage`
  const logoSuggestions: ProjectImage[] = (suggestedLogoImages || []).map(
    (blobUrl) => ({ url: blobUrl, crop: { x: 0, y: 0, w: 1, h: 1 } })
  );

  return (
    <div className={styles.container}>
      <BasicMedia
        value={value}
        logoSuggestions={logoSuggestions}
        coverSuggestions={coverSuggestions}
        onChange={onChange}
      />
      <BasicForm
        value={value}
        onChange={onChange}
        projectId={projectId}
        suggestedTags={suggestedTags}
        suggestedSlogans={suggestedSlogans}
        suggestedTitles={suggestedTitles}
        suggestedSummary={suggestedSummary}
        suggestedCustomUrls={suggestedCustomUrls}
      />
    </div>
  );
}
