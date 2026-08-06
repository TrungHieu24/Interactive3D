import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "../../store/sceneStore";

gsap.registerPlugin(ScrollTrigger);

const PRESETS: Record<string, { pos: [number, number, number] }> = {
  frontLeft: { pos: [-2.2, 0.6, 2.6] },
  frontRight: { pos: [2.2, 0.6, 2.6] },
  rearLeft: { pos: [-2.2, 0.6, -2.6] },
  rearRight: { pos: [2.2, 0.6, -2.6] },
};

export default function CameraRig() {
  const { camera } = useThree();
  const mode = useSceneStore((s) => s.mode);
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const activePart = useSceneStore((s) => s.activePart);
  const prevMode = useRef(mode);

  // Scroll cinematic — chỉ áp dụng ở Story mode
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(camera.position, {
        z: 3,
        y: 0.3,
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "45% top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    });
    return () => ctx.revert();
  }, [camera]);

  // Chuyển vào X-Ray mode → bay tới preset mặc định
  useEffect(() => {
    if (mode === "xray" && prevMode.current !== "xray") {
      const { pos } = PRESETS[cameraPreset];
      gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2], duration: 1.2, ease: "power3.inOut" });
    }
    prevMode.current = mode;
  }, [mode, camera, cameraPreset]);

  // Đổi camera preset trong X-Ray mode
  useEffect(() => {
    if (mode !== "xray") return;
    const { pos } = PRESETS[cameraPreset];
    gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2], duration: 1, ease: "power2.inOut" });
  }, [cameraPreset, mode, camera]);

  // Zoom vào bộ phận khi click
  useEffect(() => {
    if (mode !== "xray") return;
    if (activePart) {
      gsap.to(camera.position, { z: 1.6, duration: 0.9, ease: "power2.inOut" });
    } else {
      const { pos } = PRESETS[cameraPreset];
      gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2], duration: 0.9, ease: "power2.inOut" });
    }
  }, [activePart]);

  return null;
}