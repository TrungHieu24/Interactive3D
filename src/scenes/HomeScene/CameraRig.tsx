import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useSceneStore } from "../../store/sceneStore";
import { STORY_STAGES } from "../../constants/storyData";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 2.4;
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
  const controls = useThree((state) => state.controls) as unknown as OrbitControlsImpl | undefined;

  const mode = useSceneStore((s) => s.mode);
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const activePart = useSceneStore((s) => s.activePart);
  const activePartPoint = useSceneStore((s) => s.activePartPoint);
  const prevMode = useRef(mode);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const syncLookAt = (target: THREE.Vector3 | [number, number, number]) => {
    const t = Array.isArray(target) ? new THREE.Vector3(...target) : target;
    camera.lookAt(t);
    if (controls) controls.target.copy(t);
  };

  const animateCamera = (vars: gsap.TweenVars, lookAtTarget: THREE.Vector3 | [number, number, number]) => {
    if (controls) controls.enabled = false;
    gsap.to(camera.position, {
      ...vars,
      onUpdate: () => syncLookAt(lookAtTarget),
      onComplete: () => {
        if (controls) {
          controls.enabled = true; 
          controls.update();
        }
        vars.onComplete?.();
      },
    });
  };

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

  useEffect(() => {
    const st = scrollTriggerRef.current;

    if (mode === "xray" && prevMode.current !== "xray") {
      st?.disable(false);
      const [x, y, z] = XRAY_PRESETS[cameraPreset];
      animateCamera({ x, y, z, duration: 1.2, ease: "power3.inOut" }, [0, 0, 0]);
    }

    if (mode === "story" && prevMode.current === "xray") {
      animateCamera(
        {
          x: 0, y: 0, duration: 1, ease: "power3.inOut",
          onComplete: () => { st?.enable(); st?.refresh(); },
        },
        [0, 0, 0]
      );
    }

    prevMode.current = mode;
  }, [mode, camera, cameraPreset]);

  useEffect(() => {
    if (mode !== "xray") return;
    const [x, y, z] = XRAY_PRESETS[cameraPreset];
    animateCamera({ x, y, z, duration: 1, ease: "power2.inOut" }, [0, 0, 0]);
  }, [cameraPreset, mode, camera]);

  useEffect(() => {
    if (mode !== "xray") return;

    if (activePart && activePartPoint) {
      const currentDistance = camera.position.distanceTo(activePartPoint);
      const zoomDistance = Math.max(currentDistance * 0.5, 0.9);
      const dir = camera.position.clone().sub(activePartPoint).normalize().multiplyScalar(zoomDistance);
      const targetPos = activePartPoint.clone().add(dir);

      animateCamera(
        { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 1.1, ease: "power2.out" },
        activePartPoint
      );
    } else {
      const [x, y, z] = XRAY_PRESETS[cameraPreset];
      animateCamera({ x, y, z, duration: 0.9, ease: "power2.inOut" }, [0, 0, 0]);
    }
  }, [activePart, activePartPoint]);

  return null;
}