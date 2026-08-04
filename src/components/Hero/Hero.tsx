import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const tagRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(tagRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
      .from(titleRef.current, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=.3")
      .from(descRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=.5")
      .from(scrollRef.current, { opacity: 0, duration: 0.6 }, "-=.3");
  }, []);

  return (
    <section className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none">
      <p
        ref={tagRef}
        className="mb-4 text-xs md:text-sm tracking-[0.3em] text-cyan-300/80"
      >
        01 — THE VF8
      </p>

      <h1
        ref={titleRef}
        className="text-white text-4xl md:text-6xl font-bold tracking-tight max-w-2xl"
      >
        Everything, made visible.
      </h1>

      <p
        ref={descRef}
        className="mt-6 text-base md:text-lg text-gray-400 max-w-md leading-relaxed"
      >
        Meet the VinFast VF8, a dual-motor electric SUV. Scroll to see it
        come apart, layer by layer, from battery floor to glass roof.
      </p>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[10px] tracking-[0.3em]"
      >
        SCROLL
        <span className="animate-bounce">↓</span>
      </div>
    </section>
  );
}