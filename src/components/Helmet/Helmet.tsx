import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Helmet() {
  const { scene } = useGLTF("/models/helmet.glb");

  const helmetRoot = useRef<THREE.Group>(null);      // scroll cinematic: position/scale/rotation
  const entranceGroup = useRef<THREE.Group>(null);   // entrance riêng, KHÔNG đụng helmetRoot
  const helmetModel = useRef<THREE.Group>(null);     // mouse tilt riêng

  // Entrance — chỉ chạy trên entranceGroup, tách biệt hoàn toàn khỏi scroll
  useEffect(() => {
    if (!entranceGroup.current) return;

    const ctx = gsap.context(() => {
      gsap.from(entranceGroup.current!.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(entranceGroup.current!.rotation, {
        y: -Math.PI,
        duration: 1.8,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  // Scroll cinematic — chỉ chạy trên helmetRoot
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

      tl.to(helmetRoot.current!.position, { x: 1.1, duration: 1, ease: "power1.inOut" }, 0)
        .to(helmetRoot.current!.rotation, { y: "+=1.2", duration: 1, ease: "power1.inOut" }, 0)
        .to(helmetRoot.current!.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 1, ease: "power1.inOut" }, 0)
        .to(helmetRoot.current!.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" }, 1)
        .to(helmetRoot.current!.position, { y: -0.6, duration: 1, ease: "power2.in" }, 1);
    });

    return () => ctx.revert();
  }, []);

  // Mouse tilt — chỉ chạy trên helmetModel
  useFrame(({ mouse }) => {
    if (!helmetModel.current) return;

    helmetModel.current.rotation.y = THREE.MathUtils.lerp(
      helmetModel.current.rotation.y,
      mouse.x * 0.5,
      0.08
    );

    helmetModel.current.rotation.x = THREE.MathUtils.lerp(
      helmetModel.current.rotation.x,
      -mouse.y * 0.25,
      0.08
    );
  });

  return (
    <group ref={helmetRoot} scale={0.85}>
      <group ref={entranceGroup}>
        <group ref={helmetModel}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/helmet.glb");