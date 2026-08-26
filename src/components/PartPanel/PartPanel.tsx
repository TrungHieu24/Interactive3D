import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSceneStore } from "../../store/sceneStore";
import { PARTS_DATA } from "../../constants/partsData";

export default function PartPanel() {
  const activePart = useSceneStore((s) => s.activePart);
  const setActivePart = useSceneStore((s) => s.setActivePart);
  const panelRef = useRef<HTMLDivElement>(null);

  const part = PARTS_DATA.find((p) => p.id === activePart);

  useEffect(() => {
    if (!panelRef.current) return;
    if (part) {
      gsap.fromTo(panelRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    }
  }, [part]);

  if (!part) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-24 right-8 z-40 w-[340px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 text-white"
    >
      <button
        data-cursor-hover
        onClick={() => setActivePart(null)}
        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
        aria-label="Đóng"
      >
        ×
      </button>

      <span className="text-[10px] tracking-[0.25em] text-cyan-300/80">{part.category}</span>

      <h3 className="text-lg font-semibold leading-snug mt-3 mb-4 pr-6">{part.title}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {part.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-3 py-1 rounded-full border border-white/15 text-white/70">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-white/60 leading-relaxed mb-5">{part.description}</p>

      <p className="text-[10px] tracking-[0.2em] text-white/40 mb-2">CONNECTED SYSTEMS</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {part.connectedSystems.map((sys) => (
          <span key={sys} className="text-[11px] px-3 py-1 rounded-full bg-cyan-300/10 text-cyan-200">
            • {sys}
          </span>
        ))}
      </div>

      <button
        data-cursor-hover
        onClick={() => setActivePart(null)}
        className="w-full rounded-full border border-white/15 py-3 text-xs tracking-[0.15em] text-white/80 hover:bg-white/10 transition"
      >
        ← Back to Full Vehicle
      </button>
    </div>
  );
}