import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "../../store/sceneStore";
import { STORY_STAGES } from "../../constants/storyData";

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 3.2;
const EYE_HEIGHT = 0.15;

function presetPosition(angleDeg: number): [number, number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [RADIUS * Math.sin(rad), EYE_HEIGHT, RADIUS * Math.cos(rad)];
}

const XRAY_PRESETS: Record<string, [number, number, number]> = {
  frontLeft: presetPosition(35),
  frontRight: presetPosition(-35),
  rearLeft: presetPosition(145),
  rearRight: presetPosition(-145),
};

export default function CameraRig() {
  const { camera } = useThree();
  const mode = useSceneStore((s) => s.mode);
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const activePart = useSceneStore((s) => s.activePart);
  const prevMode = useRef(mode);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Camera dolly theo scroll — chỉ áp dụng ở Story mode
  useEffect(() => {
    const ctx = gsap.context(() => {
      const n = STORY_STAGES.length;
      const segDuration = 1 / (n - 1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      STORY_STAGES.forEach((stage, i) => {
        if (i === 0) return;
        const startTime = (i - 1) * segDuration;
        tl.to(camera.position, { z: stage.cameraZ, duration: segDuration, ease: "power1.inOut" }, startTime);
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;
    });

    return () => ctx.revert();
  }, [camera]);

  // Chuyển Story <-> X-Ray — tắt/bật quyền của camera dolly, tránh xung đột
  useEffect(() => {
    const st = scrollTriggerRef.current;

    if (mode === "xray" && prevMode.current !== "xray") {
      st?.disable(false);
      const [x, y, z] = XRAY_PRESETS[cameraPreset];
      gsap.to(camera.position, {
        x, y, z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => camera.lookAt(0, 0, 0),
      });
    }

    if (mode === "story" && prevMode.current === "xray") {
      gsap.to(camera.position, {
        x: 0, y: 0,
        duration: 1,
        ease: "power3.inOut",
        onUpdate: () => camera.lookAt(0, 0, 0),
        onComplete: () => {
          st?.enable();
          st?.refresh(); // resync đúng vị trí z theo scroll thật hiện tại
        },
      });
    }

    prevMode.current = mode;
  }, [mode, camera, cameraPreset]);

  useEffect(() => {
    if (mode !== "xray") return;
    const [x, y, z] = XRAY_PRESETS[cameraPreset];
    gsap.to(camera.position, { x, y, z, duration: 1, ease: "power2.inOut", onUpdate: () => camera.lookAt(0, 0, 0) });
  }, [cameraPreset, mode, camera]);

  useEffect(() => {
    if (mode !== "xray") return;
    if (activePart) {
      gsap.to(camera.position, { z: 1.6, duration: 0.9, ease: "power2.inOut", onUpdate: () => camera.lookAt(0, 0, 0) });
    } else {
      const [x, y, z] = XRAY_PRESETS[cameraPreset];
      gsap.to(camera.position, { x, y, z, duration: 0.9, ease: "power2.inOut", onUpdate: () => camera.lookAt(0, 0, 0) });
    }
  }, [activePart]);

  return null;
}