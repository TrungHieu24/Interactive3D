import { useSceneStore, type CameraPreset } from "../../store/sceneStore";

const PRESET_LABELS: { id: CameraPreset; label: string }[] = [
  { id: "frontLeft", label: "FRONT LEFT" },
  { id: "frontRight", label: "FRONT RIGHT" },
  { id: "rearLeft", label: "REAR LEFT" },
  { id: "rearRight", label: "REAR RIGHT" },
];

export default function XRayUI() {
  const mode = useSceneStore((s) => s.mode);
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const setCameraPreset = useSceneStore((s) => s.setCameraPreset);
  const activePart = useSceneStore((s) => s.activePart);

  if (mode !== "xray") return null;

  return (
    <>
      {!activePart && (
        <p className="fixed top-24 left-1/2 -translate-x-1/2 z-40 text-white/60 text-xs tracking-[0.2em] pointer-events-none">
          CLICK A PART TO INSPECT · DRAG TO ORBIT
        </p>
      )}

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl p-1">
        {PRESET_LABELS.map(({ id, label }) => (
          <button
            key={id}
            data-cursor-hover
            onClick={() => setCameraPreset(id)}
            className={`px-4 py-2 rounded-full text-[11px] tracking-[0.15em] transition ${
              cameraPreset === id ? "bg-white text-black" : "text-white/70 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}