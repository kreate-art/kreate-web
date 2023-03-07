export type ProgressScore = number; // 0.0 .. 1.0

export type ProjectProgressScores = {
  description: ProgressScore;
  basics: ProgressScore;
  // roadmap: ProgressScore;
  community: ProgressScore;
};

export type TabIndex = 0 | 1 | 2 | 3;
