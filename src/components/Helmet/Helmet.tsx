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
  const idleRotation = useRef<THREE.Group>(null);
  const helmetModel = useRef<THREE.Group>(null);

  const mode = useSceneStore((s) => s.mode);

  // Entrance khi mount — tách riêng khỏi mọi animation scroll
  useEffect(() => {
    if (!entranceGroup.current) return;
    const ctx = gsap.context(() => {
      gsap.from(entranceGroup.current!.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  // Timeline keyframe — đi qua từng "trạm" trong STORY_STAGES, KHÔNG bao giờ về scale 0
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
        if (i === 0) return; // stage đầu là trạng thái khởi điểm, không cần tween
        const startTime = (i - 1) * segDuration;

        tl.to(
          helmetRoot.current!.rotation,
          { y: stage.rotationY, duration: segDuration, ease: "power1.inOut" },
          startTime
        )
          .to(
            helmetRoot.current!.position,
            { x: stage.positionX, duration: segDuration, ease: "power1.inOut" },
            startTime
          )
          .to(
            helmetRoot.current!.scale,
            { x: stage.scale, y: stage.scale, z: stage.scale, duration: segDuration, ease: "power1.inOut" },
            startTime
          );
      });
    });

    return () => ctx.revert();
  }, []);

  // Idle spin nhẹ + nghiêng theo chuột — chỉ ở Story mode
  useFrame(({ mouse }, delta) => {
    if (mode !== "story") return;
    if (idleRotation.current) idleRotation.current.rotation.y += delta * 0.08; // chậm hơn vì đã có xoay theo scroll
    if (helmetModel.current) {
      helmetModel.current.rotation.y = THREE.MathUtils.lerp(helmetModel.current.rotation.y, mouse.x * 0.15, 0.06);
      helmetModel.current.rotation.x = THREE.MathUtils.lerp(helmetModel.current.rotation.x, -mouse.y * 0.1, 0.06);
    }
  });

  return (
    <group ref={helmetRoot} scale={STORY_STAGES[0].scale} position={[STORY_STAGES[0].positionX, 0, 0]}>
      <group ref={entranceGroup}>
        <group ref={idleRotation}>
          <group ref={helmetModel}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/helmet.glb");