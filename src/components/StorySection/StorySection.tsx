import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryStage } from "../../constants/storyData";
import { STAGE_HEIGHT_VH } from "../../constants/storyData";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  stage: StoryStage;
  isFirst?: boolean;
  cta?: { label: string; onClick: () => void };
}

export default function StorySection({ stage, isFirst, cta }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (isFirst) {
        gsap.from(wrapperRef.current!.children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        });
      } else {
        gsap.set(wrapperRef.current, { opacity: 0, y: 40 });
      }

      gsap.to(wrapperRef.current, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 100%",
          end: "top 55%",
          scrub: 0.6,
        },
      });

      gsap.to(wrapperRef.current, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 55%",
          end: "bottom 10%",
          scrub: 0.6,
        },
      });
    });

    return () => ctx.revert();
  }, [isFirst]);

  return (
    <section ref={sectionRef} style={{ height: `${STAGE_HEIGHT_VH}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-8 md:px-20">
        <div ref={wrapperRef} className="max-w-xl">
          <p className="mb-4 text-xs md:text-sm tracking-[0.3em] text-cyan-300/80 pointer-events-none">
            {stage.tag}
          </p>

          <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight pointer-events-none">
            {stage.title}
          </h2>

          <p className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed pointer-events-none">
            {stage.description}
          </p>

          {isFirst && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[10px] tracking-[0.3em] pointer-events-none">
              SCROLL
              <span className="animate-bounce">↓</span>
            </div>
          )}

          {cta && (
            <button
              data-cursor-hover
              onClick={cta.onClick}
              className="pointer-events-auto mt-10 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-8 py-4 text-sm tracking-[0.15em] text-white backdrop-blur-xl transition hover:bg-cyan-300/20"
            >
              {cta.label}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}