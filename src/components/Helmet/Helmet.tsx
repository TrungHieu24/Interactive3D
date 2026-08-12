import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "../../store/sceneStore";
import { STORY_STAGES } from "../../constants/storyData";

gsap.registerPlugin(ScrollTrigger);

export default function Helmet() {
  const { scene } = useGLTF("/models/helmet.glb");

  const helmetRoot = useRef<THREE.Group>(null);
  const entranceGroup = useRef<THREE.Group>(null);
  const helmetModel = useRef<THREE.Group>(null);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const prevMode = useRef<string>("story");

  const mode = useSceneStore((s) => s.mode);

  // Entrance khi mount
  useEffect(() => {
    if (!entranceGroup.current) return;
    const ctx = gsap.context(() => {
      gsap.from(entranceGroup.current!.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  // Timeline theo scroll — CHỈ chi phối helmetRoot khi đang ở Story mode
  useEffect(() => {
    if (!helmetRoot.current) return;

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
        tl.to(helmetRoot.current!.rotation, { y: stage.rotationY, duration: segDuration, ease: "power1.inOut" }, startTime)
          .to(helmetRoot.current!.position, { x: stage.positionX, duration: segDuration, ease: "power1.inOut" }, startTime)
          .to(helmetRoot.current!.scale, { x: stage.scale, y: stage.scale, z: stage.scale, duration: segDuration, ease: "power1.inOut" }, startTime);
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;
    });

    return () => ctx.revert();
  }, []);

  // Chuyển Story <-> X-Ray: tắt/bật quyền điều khiển của scroll timeline
  useEffect(() => {
    if (!helmetRoot.current) return;
    const st = scrollTriggerRef.current;

if (mode === "xray" && prevMode.current !== "xray") {
  st?.disable(false);

  // Về ĐÚNG góc gốc như lúc mới load trang — không xoay lệch nữa
  gsap.to(helmetRoot.current.rotation, { y: 0, duration: 1, ease: "power3.inOut" });
  gsap.to(helmetRoot.current.position, { x: 0, y: 0, duration: 1, ease: "power3.inOut" });
  gsap.to(helmetRoot.current.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 1, ease: "power3.inOut" });
}

    if (mode === "story" && prevMode.current === "xray") {
      // Bật lại + tính lại đúng theo vị trí scroll THẬT hiện tại (không snap sai)
      st?.enable();
      st?.refresh();
    }

    prevMode.current = mode;
  }, [mode]);

  // Chỉ còn nghiêng nhẹ theo chuột — KHÔNG còn tự xoay khi đứng yên
  useFrame(({ mouse }) => {
    if (mode !== "story" || !helmetModel.current) return;
    helmetModel.current.rotation.y = THREE.MathUtils.lerp(helmetModel.current.rotation.y, mouse.x * 0.1, 0.05);
    helmetModel.current.rotation.x = THREE.MathUtils.lerp(helmetModel.current.rotation.x, -mouse.y * 0.06, 0.05);
  });

  return (
    <group ref={helmetRoot} scale={STORY_STAGES[0].scale} position={[STORY_STAGES[0].positionX, 0, 0]}>
      <group ref={entranceGroup}>
        <group ref={helmetModel}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/helmet.glb");