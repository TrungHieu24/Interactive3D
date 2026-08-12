import Scene from "../scenes/HomeScene/Scene";
import StorySection from "../components/StorySection/StorySection";
import Navbar from "../components/Navbar/Navbar";
import SmoothScroll from "../components/SmoothScroll/SmoothScroll";
import XRayUI from "../components/XRayUI/XRayUI";
import PartPanel from "../components/PartPanel/PartPanel";
import ScrollDots from "../components/ScrollDots/ScrollDots";
import { STORY_STAGES, STAGE_HEIGHT_VH } from "../constants/storyData";
import { useSceneStore } from "../store/sceneStore";

export default function Home() {
  const mode = useSceneStore((s) => s.mode);
  const setMode = useSceneStore((s) => s.setMode);

  return (
    <main
      className="scroll-container relative w-screen overflow-hidden"
      style={{ height: `${STORY_STAGES.length * STAGE_HEIGHT_VH}vh` }}
    >
      <SmoothScroll />
      <Navbar />

      <div className="fixed inset-0">
        <Scene />
      </div>

      <XRayUI />
      <PartPanel />
      <ScrollDots />

      <div className={`transition-opacity duration-500 ${mode === "story" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {STORY_STAGES.map((stage, i) => (
          <StorySection
            key={stage.id}
            stage={stage}
            isFirst={i === 0}
            cta={i === STORY_STAGES.length - 1 ? { label: "Enter the X-Ray →", onClick: () => setMode("xray") } : undefined}
          />
        ))}
      </div>
    </main>
  );
}