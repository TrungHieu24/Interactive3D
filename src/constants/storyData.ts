export const STAGE_HEIGHT_VH = 150;

export interface StoryStage {
  id: string;
  tag: string;
  title: string;
  description: string;
  rotationY: number;
  positionX: number;
  scale: number;
  cameraZ: number;
}

const FULL_TURN = Math.PI * 2;
const STEP = FULL_TURN / 6; 

export const STORY_STAGES: StoryStage[] = [
  {
    id: "overview",
    tag: "01 — OVERVIEW",
    title: "Every detail, engineered.",
    description: "A closer look at the full helmet — structure, airflow, and fit working together as one system.",
    rotationY: STEP * 0,
    positionX: 0,
    scale: 0.85,
    cameraZ: 4,
  },
  {
    id: "shell",
    tag: "02 — SHELL",
    title: "Built for impact.",
    description: "A composite outer shell spreads impact energy across the surface, keeping the load off any single point.",
    rotationY: STEP * 1,
    positionX: 0.2,
    scale: 0.65,
    cameraZ: 2.4,
  },
  {
    id: "visor",
    tag: "03 — VISOR",
    title: "See it all, clearly.",
    description: "An anti-fog, UV-coated visor keeps vision sharp in any condition, from bright sun to heavy rain.",
    rotationY: STEP * 2, 
    positionX: -0.2,
    scale: 0.68,
    cameraZ: 2.1,
  },
  {
    id: "airflow",
    tag: "04 — AIRFLOW",
    title: "Cool, every ride.",
    description: "Channeled vents pull air through the interior padding, keeping you comfortable over long rides.",
    rotationY: STEP * 3, 
    positionX: 0.2,
    scale: 0.65,
    cameraZ: 2.5,
  },
  {
    id: "padding",
    tag: "05 — PADDING",
    title: "Soft where it counts.",
    description: "Multi-density foam padding cushions impact while staying breathable against the skin.",
    rotationY: STEP * 4, 
    positionX: -0.2,
    scale: 0.65,
    cameraZ: 2.5,
  },
  {
    id: "fit",
    tag: "06 — FIT",
    title: "Made to fit you.",
    description: "Adjustable straps and a contoured shell give a secure, personalized fit for every head shape.",
    rotationY: STEP * 5,
    positionX: 0.1,
    scale: 0.75,
    cameraZ: 3,
  },
  {
    id: "explore",
    tag: "07 — EXPLORE",
    title: "Take it apart yourself.",
    description: "Step inside the interactive X-Ray. Tap any layer to see how every piece fits together.",
    rotationY: STEP * 6, 
    positionX: 0,
    scale: 0.85,
    cameraZ: 4,
  },
];