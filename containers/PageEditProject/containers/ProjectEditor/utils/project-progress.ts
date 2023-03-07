import { generateText } from "@tiptap/core";

import { ProgressScore, ProjectProgressScores } from "../../../types";

import {
  Project,
  ProjectBasics,
  ProjectCommunity,
  ProjectDescription,
  ProjectRoadmap,
} from "@/modules/business-types";
import { editorExtensions } from "@/modules/teiki-components/components/RichTextEditor/config";

export function getProjectProgressScores(
  project: Project
): ProjectProgressScores {
  return {
    description: getDescriptionProgress(project.description),
    basics: getBasicProgress(project.basics),
    // roadmap: getRoadmapProgress(project.roadmap),
    community: getCommunityProgress(project.community),
  };
}

function getDescriptionProgress(
  description: ProjectDescription
): ProgressScore {
  const bodyContent = description.body;
  const textContent = generateText(bodyContent, editorExtensions);
  return textContent.length > 100 ? 1.0 : 0.0;
}

function getBasicProgress(basic: ProjectBasics): ProgressScore {
  return (
    (basic.title.length > 0 ? 0.5 : 0) + (basic.customUrl.length > 0 ? 0.5 : 0)
  );
}

function getRoadmapProgress(roadmap: ProjectRoadmap): ProgressScore {
  if (roadmap.length > 0) {
    return roadmap.some(
      (milestone) => milestone.name === "" || milestone.description === ""
    )
      ? 0.5
      : 1.0;
  }
  return 0.0;
}

function getCommunityProgress(community: ProjectCommunity): ProgressScore {
  if (community.socialChannels.length > 0) {
    if (community.frequentlyAskedQuestions.length > 0) {
      const hasIncompleteFaq: boolean = community.frequentlyAskedQuestions.some(
        (frequentlyAskedQuestion) =>
          !frequentlyAskedQuestion.answer || !frequentlyAskedQuestion.question
      );

      return hasIncompleteFaq ? 0.5 : 1;
    }
    return 1.0;
  }
  return 0.0;
}
