import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSceneStore } from "../../store/sceneStore";

export default function Explore() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const setMode = useSceneStore((s) => s.setMode);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center px-8 md:px-20">
      <div ref={sectionRef} className="max-w-xl pointer-events-none">
        <p className="mb-4 text-xs md:text-sm tracking-[0.3em] text-cyan-300/80">
          02 — EXPLORE
        </p>

        <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
          Take it apart yourself.
        </h2>

        <p className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed">
          Step inside the interactive X-Ray. Tap any layer to peel the
          VinFast VF8 open, from motors to sensors, and see how every
          piece fits together.
        </p>

        <button
          data-cursor-hover
          onClick={() => setMode("xray")}
          className="
            pointer-events-auto
            mt-10
            rounded-full
            border border-cyan-300/30
            bg-cyan-300/10
            px-8 py-4
            text-sm tracking-[0.15em] text-white
            backdrop-blur-xl
            transition
            hover:bg-cyan-300/20
          "
        >
          Enter the X-Ray →
        </button>
      </div>
    </section>
  );
}