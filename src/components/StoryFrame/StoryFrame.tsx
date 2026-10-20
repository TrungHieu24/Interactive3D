import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_STAGES } from "../../constants/storyData";
import { useSceneStore } from "../../store/sceneStore";

gsap.registerPlugin(ScrollTrigger);

const ENTER_BEFORE = 0.45;
const EXIT_AFTER = 0.1;
const EXIT_LENGTH = 0.35;

function MaskedWords({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
            <span className={`inline-block ${className}`}>{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

function DimWords({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={`inline-block ${className}`}>{word}</span>
        </Fragment>
      ))}
    </>
  );
}

const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)";

export default function StoryFrame() {
  const mode = useSceneStore((s) => s.mode);
  const setMode = useSceneStore((s) => s.setMode);

  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const panels = panelRefs.current;
    if (!introRef.current || !cueRef.current || panels.length === 0) return;

    const ctx = gsap.context(() => {
      const n = STORY_STAGES.length;

      gsap.from(introRef.current, { opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out" });
      if (panels[0]) {
        gsap.from(panels[0].querySelectorAll(".js-title-word"), {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.08,
          delay: 0.35,
          ease: "power3.out",
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      panels.forEach((panel, i) => {
        if (!panel) return;

        const tag = panel.querySelectorAll(".js-tag");
        const titleWords = panel.querySelectorAll(".js-title-word");
        const descWords = panel.querySelectorAll(".js-desc-word");
        const cta = panel.querySelectorAll(".js-cta");

        if (i > 0) {
          const t0 = i - ENTER_BEFORE;

          tl.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, t0);

          if (tag.length)
            tl.fromTo(tag, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, t0);

          if (titleWords.length)
            tl.fromTo(
              titleWords,
              { yPercent: 115 },
              { yPercent: 0, duration: 0.16, ease: "power3.out", stagger: { amount: 0.06 } },
              t0 + 0.04
            );

          if (descWords.length)
            tl.fromTo(
              descWords,
              { opacity: 0.1, y: 10 },
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out", stagger: { amount: 0.14 } },
              t0 + 0.1
            );

          if (cta.length)
            tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, t0 + 0.22);
        }

        if (i < n - 1) {
          tl.fromTo(
            panel,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -48, duration: EXIT_LENGTH, ease: "power2.in", immediateRender: false },
            i + EXIT_AFTER
          );
        }
      });

      tl.fromTo(
        cueRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 0.12, immediateRender: false },
        0
      );

      tl.to({}, { duration: 0 }, n - 1);
    });

    return () => ctx.revert();
  }, []);

  const isStory = mode === "story";

  return (
    <div
      className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-500 ${
        isStory ? "opacity-100" : "opacity-0"
      }`}
    >
      <div ref={introRef} className="absolute inset-0">
        <div
          className="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 w-[min(600px,calc(100vw-4rem))] h-[min(500px,68vh)] overflow-hidden"
          style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
        >
          {STORY_STAGES.map((stage, i) => {
            const isLast = i === STORY_STAGES.length - 1;

            return (
              <div
                key={stage.id}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <p className="js-tag mb-4 text-xs md:text-sm tracking-[0.3em] text-cyan-300/80">{stage.tag}</p>

                <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                  <MaskedWords text={stage.title} className="js-title-word" />
                </h2>

                <p className="mt-6 max-w-md text-base md:text-lg text-gray-300 leading-relaxed">
                  <DimWords text={stage.description} className="js-desc-word" />
                </p>

                {isLast && (
                  <div>
                    <button
                      data-cursor-hover
                      disabled={!isStory}
                      onClick={() => setMode("xray")}
                      className="js-cta pointer-events-auto disabled:pointer-events-none mt-10 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-8 py-4 text-sm tracking-[0.15em] text-white transition hover:bg-cyan-300/20"
                    >
                      Enter the X-Ray →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          ref={cueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[10px] tracking-[0.3em]"
        >
          SCROLL
          <span className="animate-bounce">↓</span>
        </div>
      </div>
    </div>
  );
}