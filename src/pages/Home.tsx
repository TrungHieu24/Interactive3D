import Scene from "../scenes/HomeScene/Scene";
import StoryFrame from "../components/StoryFrame/StoryFrame";
import Navbar from "../components/Navbar/Navbar";
import SmoothScroll from "../components/SmoothScroll/SmoothScroll";
import XRayUI from "../components/XRayUI/XRayUI";
import PartPanel from "../components/PartPanel/PartPanel";
import ScrollDots from "../components/ScrollDots/ScrollDots";
import { STORY_STAGES, STAGE_HEIGHT_VH } from "../constants/storyData";

export default function Home() {
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

      <StoryFrame />
    </main>
  );
}