import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_STAGES } from "../../constants/storyData";
import { useSceneStore } from "../../store/sceneStore";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollDots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mode = useSceneStore((s) => s.mode);

  useEffect(() => {
    const n = STORY_STAGES.length;

    const st = ScrollTrigger.create({
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setActiveIndex(Math.round(self.progress * (n - 1)));
      },
    });

    return () => st.kill();
  }, []);

  const goToStage = (index: number) => {
    const n = STORY_STAGES.length;
    const container = document.querySelector(".scroll-container") as HTMLElement;
    if (!container) return;

    const scrollableHeight = container.scrollHeight - window.innerHeight;
    const targetY = (index / (n - 1)) * scrollableHeight;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  if (mode !== "story") return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
      {STORY_STAGES.map((stage, i) => (
        <button
          key={stage.id}
          data-cursor-hover
          onClick={() => goToStage(i)}
          aria-label={stage.tag}
          className="group relative flex items-center justify-center p-1.5"
        >
          <span
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-2 h-2 bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.6)]"
                : "w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60"
            }`}
          />
        </button>
      ))}
    </div>
  );
}