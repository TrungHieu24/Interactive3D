import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "../../store/sceneStore";
import { STORY_STAGES } from "../../constants/storyData";
import { applyGlassMaterial } from "../../materials/glassMaterial";
import { findPartByMeshName } from "../../constants/partsData";

gsap.registerPlugin(ScrollTrigger);

// ① Hằng số scale X-Ray — dùng chung ở cả chỗ animate lẫn chỗ đo bounding box
const XRAY_ENTER_SCALE = 1.3;

export default function Engine() {
  const { scene } = useGLTF("/models/V6Engine-2.glb");

  const engineRoot = useRef<THREE.Group>(null);
  const entranceGroup = useRef<THREE.Group>(null);
  const engineModel = useRef<THREE.Group>(null);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const prevMode = useRef<string>("story");

  const mode = useSceneStore((s) => s.mode);
  const setActivePart = useSceneStore((s) => s.setActivePart);
  const setXrayLookTarget = useSceneStore((s) => s.setXrayLookTarget); 

  const glassScene = useMemo(() => applyGlassMaterial(scene), [scene]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    center.multiplyScalar(XRAY_ENTER_SCALE);
    setXrayLookTarget(center);
    console.log("[Engine] xrayLookTarget =", center);
  }, [scene, setXrayLookTarget]);

  useEffect(() => {
    if (!entranceGroup.current) return;
    const ctx = gsap.context(() => {
      gsap.from(entranceGroup.current!.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!engineRoot.current) return;

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
        tl.to(engineRoot.current!.rotation, { y: stage.rotationY, duration: segDuration, ease: "power1.inOut" }, startTime)
          .to(engineRoot.current!.position, { x: stage.positionX, duration: segDuration, ease: "power1.inOut" }, startTime)
          .to(engineRoot.current!.scale, { x: stage.scale, y: stage.scale, z: stage.scale, duration: segDuration, ease: "power1.inOut" }, startTime);
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!engineRoot.current) return;
    const st = scrollTriggerRef.current;

    if (mode === "xray" && prevMode.current !== "xray") {
      st?.disable(false);
      gsap.to(engineRoot.current.rotation, { y: 0, duration: 1, ease: "power3.inOut" });
      gsap.to(engineRoot.current.position, { x: 0, y: 0, duration: 1, ease: "power3.inOut" });
      // ③ Dùng XRAY_ENTER_SCALE thay vì số cứng 1.3 — luôn đồng bộ với đoạn đo bounding box
      gsap.to(engineRoot.current.scale, { x: XRAY_ENTER_SCALE, y: XRAY_ENTER_SCALE, z: XRAY_ENTER_SCALE, duration: 1, ease: "power3.inOut" });
    }

    if (mode === "story" && prevMode.current === "xray") {
      st?.enable();
      st?.refresh();
    }

    prevMode.current = mode;
  }, [mode]);

  useFrame(({ mouse }) => {
    if (mode !== "story" || !engineModel.current) return;
    engineModel.current.rotation.y = THREE.MathUtils.lerp(engineModel.current.rotation.y, mouse.x * 0.1, 0.05);
    engineModel.current.rotation.x = THREE.MathUtils.lerp(engineModel.current.rotation.x, -mouse.y * 0.06, 0.05);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (mode !== "xray") return;
    e.stopPropagation();
    const meshName = e.object.name;
    const part = findPartByMeshName(meshName);
    if (part) {
      setActivePart(part.id, e.point.clone());
    }
  };

  return (
    <group ref={engineRoot} scale={STORY_STAGES[0].scale} position={[STORY_STAGES[0].positionX, 0, 0]} castShadow={false}>
      <group ref={entranceGroup}>
        <group ref={engineModel} onClick={handleClick}>
          <primitive object={glassScene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/V6Engine-2.glb");