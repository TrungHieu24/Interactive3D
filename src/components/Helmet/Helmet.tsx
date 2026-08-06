import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "../../store/sceneStore";
import { findPartByMeshName } from "../../constants/partsData";
import type { ThreeEvent } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

export default function Helmet() {
  const { scene } = useGLTF("/models/helmet.glb");

  const helmetRoot = useRef<THREE.Group>(null);
  const entranceGroup = useRef<THREE.Group>(null);
  const idleRotation = useRef<THREE.Group>(null);
  const helmetModel = useRef<THREE.Group>(null);

  const mode = useSceneStore((s) => s.mode);
  const activePart = useSceneStore((s) => s.activePart);
  const setActivePart = useSceneStore((s) => s.setActivePart);

  // Debug: in ra tên tất cả mesh — mở console để lấy tên thật, sau đó xóa dòng này
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log("Mesh name:", child.name);
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!entranceGroup.current) return;
    const ctx = gsap.context(() => {
      gsap.from(entranceGroup.current!.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power3.out" });
      gsap.from(entranceGroup.current!.rotation, { y: -Math.PI, duration: 1.8, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!helmetRoot.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(helmetRoot.current!.rotation, { y: "+=0.6", duration: 0.45, ease: "none" }, 0)
        .to(helmetRoot.current!.position, { x: 1.1, duration: 0.15, ease: "power1.inOut" }, 0.45)
        .to(helmetRoot.current!.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 0.15, ease: "power1.inOut" }, 0.45)
        .to(helmetRoot.current!.rotation, { y: "+=0.8", duration: 0.15, ease: "power1.inOut" }, 0.45)
        .to(helmetRoot.current!.scale, { x: 0, y: 0, z: 0, duration: 0.45, ease: "power2.in" }, 0.55)
        .to(helmetRoot.current!.position, { y: -0.6, duration: 0.45, ease: "power2.in" }, 0.55);
    });
    return () => ctx.revert();
  }, []);

  useFrame(({ mouse }, delta) => {
    if (mode !== "story") return; // idle spin + mouse tilt chỉ chạy ở Story mode
    if (idleRotation.current) idleRotation.current.rotation.y += delta * 0.2;
    if (helmetModel.current) {
      helmetModel.current.rotation.y = THREE.MathUtils.lerp(helmetModel.current.rotation.y, mouse.x * 0.3, 0.08);
      helmetModel.current.rotation.x = THREE.MathUtils.lerp(helmetModel.current.rotation.x, -mouse.y * 0.2, 0.08);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (mode !== "xray") return;
    e.stopPropagation();

    const meshName = e.object.name;
    const part = findPartByMeshName(meshName);
    setActivePart(part ? part.id : null);
  };

  return (
    <group ref={helmetRoot} scale={0.85}>
      <group ref={entranceGroup}>
        <group ref={idleRotation}>
          <group ref={helmetModel} onClick={handleClick}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/helmet.glb");