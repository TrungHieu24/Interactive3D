import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(camera.position, {
        z: 3,
        y: 0.3,
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "center top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [camera]);

  return null;
}