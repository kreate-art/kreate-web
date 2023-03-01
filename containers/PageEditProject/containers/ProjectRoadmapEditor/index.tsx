import moment from "moment";
import * as React from "react";
import * as Uuid from "uuid";

import IconPlus from "./assets/IconPlus";
import MilestoneDetail from "./components/MilestoneDetail";
import MilestoneInput from "./components/MilestoneInput";
import styles from "./index.module.scss";

import { ProjectMilestone, ProjectRoadmap } from "@/modules/business-types";
import Button from "@/modules/teiki-ui/components/Button";

type Props = {
  value: ProjectRoadmap;
  onChange: (newRoadmap: ProjectRoadmap) => void;
};

export default function ProjectRoadmapEditor({ value, onChange }: Props) {
  const getSuggestedNameForNewMilestone = () => {
    let minIndex = 1;
    while (true) {
      const mileStoneName = "Milestone " + minIndex;
      if (
        value.some(
          (mileStone: ProjectMilestone) => mileStone.name == mileStoneName
        )
      ) {
        minIndex++;
      } else {
        return mileStoneName;
      }
    }
  };
  const addMilestone = () => {
    const milestoneName = getSuggestedNameForNewMilestone();
    onChange([
      ...value,
      {
        id: Uuid.v4(),
        dateIso: moment().format("YYYY-MM-DD"),
        name: milestoneName,
        description: "",
        funding: undefined,
        isCompleted: false,
      },
    ]);
  };
  const updateMilestone = (id: string, newValue: ProjectMilestone) => {
    onChange(
      value.map((milestone: ProjectMilestone) => {
        if (milestone.id === id) return newValue;
        return milestone;
      })
    );
  };
  const deleteMilestone = (id: string) => {
    onChange(
      value.filter((milestone: ProjectMilestone) => {
        return milestone.id !== id;
      })
    );
  };
  return (
    <div className={styles.roadmapMain}>
      <div
        style={{
          position: "relative",
          width: "33%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {value.map((milestone: ProjectMilestone) => (
          <MilestoneInput
            value={milestone}
            onChange={(newValue: ProjectMilestone) =>
              updateMilestone(milestone.id, newValue)
            }
            onDelete={() => deleteMilestone(milestone.id)}
            key={milestone.id}
          />
        ))}
        <Button.Solid
          icon={<IconPlus />}
          content="Add Milestone"
          onClick={addMilestone}
          className={styles.addMilestoneButton}
          size="small"
        />
      </div>
      <div className={styles.line} />
      <div className={styles.milestoneContainer}>
        {value.map((milestone: ProjectMilestone, index: number) => (
          <MilestoneDetail {...milestone} key={index} />
        ))}
      </div>
    </div>
  );
}
