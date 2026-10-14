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

  function presetOffset(angleDeg: number): THREE.Vector3 {
    const rad = (angleDeg * Math.PI) / 180;
    return new THREE.Vector3(RADIUS * Math.sin(rad), EYE_HEIGHT, RADIUS * Math.cos(rad));
  }

  const XRAY_PRESETS: Record<string, THREE.Vector3> = {
    frontLeft: presetOffset(35),
    frontRight: presetOffset(-35),
    rearLeft: presetOffset(145),
    rearRight: presetOffset(-145),
  };

  interface FlyOptions {
    duration?: number;
    ease?: string;
    onComplete?: () => void;
  }

  export default function CameraRig() {
    const { camera } = useThree();
    const controls = useThree((state) => state.controls) as unknown as OrbitControlsImpl | undefined;

    const mode = useSceneStore((s) => s.mode);
    const cameraPreset = useSceneStore((s) => s.cameraPreset);
    const activePart = useSceneStore((s) => s.activePart);
    const activePartPoint = useSceneStore((s) => s.activePartPoint);
    const xrayLookTarget = useSceneStore((s) => s.xrayLookTarget);

    const prevMode = useRef(mode);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const lookTarget = useRef(new THREE.Vector3(0, 0, 0)); // điểm camera đang nhìn — được tween, không bị snap
    const flight = useRef<gsap.core.Timeline | null>(null);

    // Bay camera: vị trí + điểm nhìn chạy CÙNG timeline, CÙNG ease → pan + dolly liền mạch
    const flyTo = (
      position: THREE.Vector3,
      lookAt: THREE.Vector3,
      { duration = 1.2, ease = "power3.inOut", onComplete }: FlyOptions = {}
    ) => {
      flight.current?.kill(); // chỉ hủy chuyến bay trước, không đụng tween scroll
      if (controls) controls.enabled = false;

      flight.current = gsap
        .timeline({
          defaults: { duration, ease },
          onUpdate: () => camera.lookAt(lookTarget.current),
          onComplete: () => {
            if (controls) {
              controls.target.copy(lookTarget.current);
              controls.enabled = true;
              controls.update();
            }
            onComplete?.();
          },
        })
        .to(camera.position, { x: position.x, y: position.y, z: position.z }, 0)
        .to(lookTarget.current, { x: lookAt.x, y: lookAt.y, z: lookAt.z }, 0);
    };

    const presetPosition = () => XRAY_PRESETS[cameraPreset].clone().add(xrayLookTarget);

    // Camera dolly theo scroll (Story mode)
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

    // Story <-> X-Ray
    useEffect(() => {
      const st = scrollTriggerRef.current;

      if (mode === "xray" && prevMode.current !== "xray") {
        st?.disable(false);
        flyTo(presetPosition(), xrayLookTarget, { duration: 1.2 });
      }

      if (mode === "story" && prevMode.current === "xray") {
        flyTo(new THREE.Vector3(0, 0, 4), new THREE.Vector3(0, 0, 0), {
          duration: 1,
          onComplete: () => {
            st?.enable();
            st?.refresh();
          },
        });
      }

      prevMode.current = mode;
    }, [mode]);

    // Đổi góc preset (chỉ chạy khi preset đổi, không chạy lúc vừa vào X-Ray → hết tween trùng)
    useEffect(() => {
      if (mode !== "xray") return;
      flyTo(presetPosition(), xrayLookTarget, { duration: 1.1 });
    }, [cameraPreset]);

    // Click vào bộ phận / bấm "Back to Full Vehicle"
    useEffect(() => {
      if (mode !== "xray") return;

      if (activePart && activePartPoint) {
        const distance = camera.position.distanceTo(activePartPoint);
        const zoomDistance = Math.max(distance * 0.5, 0.9);
        const dir = camera.position.clone().sub(activePartPoint).normalize().multiplyScalar(zoomDistance);

        flyTo(activePartPoint.clone().add(dir), activePartPoint, { duration: 1.3 });
      } else {
        flyTo(presetPosition(), xrayLookTarget, { duration: 1.1 });
      }
    }, [activePart, activePartPoint]);

    return null;
  }