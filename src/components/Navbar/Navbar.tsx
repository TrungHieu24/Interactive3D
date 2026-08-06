import { useSceneStore } from "../../store/sceneStore";

export default function Navbar() {
  const mode = useSceneStore((s) => s.mode);
  const setMode = useSceneStore((s) => s.setMode);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-8 md:px-12 py-6 flex items-start justify-between pointer-events-none">
      <div className="flex flex-col gap-4 pointer-events-auto">
        <div className="leading-none">
          <div className="text-white text-sm font-bold tracking-[0.25em]">VINFAST</div>
          <div className="text-[10px] text-cyan-300/70 tracking-[0.3em] mt-1">X-RAY CONCEPT</div>
        </div>

        <button
          data-cursor-hover
          onClick={() => setMode(mode === "story" ? "xray" : "story")}
          className="w-fit flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] tracking-[0.2em] text-white/80 backdrop-blur-xl transition hover:bg-white/10"
        >
          {mode === "story" ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              X-RAY MODE
            </>
          ) : (
            <>↑ STORY</>
          )}
        </button>
      </div>

      <div className="pointer-events-auto text-white/50 text-[11px] tracking-[0.15em] whitespace-nowrap">
        IMMERSIVE BY <span className="text-white/80 font-semibold">pathtech</span>
      </div>
    </header>
  );
}