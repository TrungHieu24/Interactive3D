export interface StoryStage {
  id: string;
  tag: string;
  title: string;
  description: string;
  rotationY: number; // góc xoay TUYỆT ĐỐI đạt được ở cuối stage này (radian)
  positionX: number;
  scale: number;
}

export const STORY_STAGES: StoryStage[] = [
  {
    id: "overview",
    tag: "01 — OVERVIEW",
    title: "Every detail, engineered.",
    description:
      "A closer look at the full helmet — structure, airflow, and fit working together as one system.",
    rotationY: 0,
    positionX: 0,
    scale: 0.85,
  },
  {
    id: "shell",
    tag: "02 — SHELL",
    title: "Built for impact.",
    description:
      "A composite outer shell spreads impact energy across the surface, keeping the load off any single point.",
    rotationY: Math.PI * 0.55,
    positionX: 1.0,
    scale: 0.62,
  },
  {
    id: "airflow",
    tag: "03 — AIRFLOW",
    title: "Cool, every ride.",
    description:
      "Channeled vents pull air through the interior padding, keeping you comfortable over long rides.",
    rotationY: Math.PI * 1.1,
    positionX: -1.0,
    scale: 0.62,
  },
  {
    id: "explore",
    tag: "04 — EXPLORE",
    title: "Take it apart yourself.",
    description:
      "Step inside the interactive X-Ray. Tap any layer to see how every piece fits together.",
    rotationY: Math.PI * 1.6,
    positionX: 0,
    scale: 0.85,
  },
];