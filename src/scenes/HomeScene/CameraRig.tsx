import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSceneStore } from "../../store/sceneStore";

const PRESETS: Record<string, [number, number, number]> = {
  frontLeft: [-2.2, 0.6, 2.6],
  frontRight: [2.2, 0.6, 2.6],
  rearLeft: [-2.2, 0.6, -2.6],
  rearRight: [2.2, 0.6, -2.6],
};

export default function CameraRig() {
  const { camera } = useThree();
  const mode = useSceneStore((s) => s.mode);
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const activePart = useSceneStore((s) => s.activePart);
  const prevMode = useRef(mode);

  useEffect(() => {
    if (mode === "xray" && prevMode.current !== "xray") {
      const [x, y, z] = PRESETS[cameraPreset];
      gsap.to(camera.position, { x, y, z, duration: 1.2, ease: "power3.inOut" });
    }
    if (mode === "story" && prevMode.current === "xray") {
      gsap.to(camera.position, { x: 0, y: 0, z: 4, duration: 1, ease: "power3.inOut" });
    }
    prevMode.current = mode;
  }, [mode, camera, cameraPreset]);

  useEffect(() => {
    if (mode !== "xray") return;
    const [x, y, z] = PRESETS[cameraPreset];
    gsap.to(camera.position, { x, y, z, duration: 1, ease: "power2.inOut" });
  }, [cameraPreset, mode, camera]);

  useEffect(() => {
    if (mode !== "xray") return;
    if (activePart) {
      gsap.to(camera.position, { z: 1.6, duration: 0.9, ease: "power2.inOut" });
    } else {
      const [x, y, z] = PRESETS[cameraPreset];
      gsap.to(camera.position, { x, y, z, duration: 0.9, ease: "power2.inOut" });
    }
  }, [activePart]);

  return null;
}