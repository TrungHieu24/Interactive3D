import Scene from "../scenes/HomeScene/Scene";
import Hero from "../components/Hero/Hero";
import Explore from "../components/Explore/Explore";
import Navbar from "../components/Navbar/Navbar";
import SmoothScroll from "../components/SmoothScroll/SmoothScroll";
import { useSceneStore } from "../store/sceneStore";

export default function Home() {
  const mode = useSceneStore((s) => s.mode);

  return (
    <main className="scroll-container relative w-screen h-[200vh] overflow-hidden">
      <SmoothScroll />

      <Navbar />

      <div className="fixed inset-0">
        <Scene />
      </div>

      {/* Story mode: scroll narrative, ẩn khi vào X-Ray mode */}
      <div
        className={`transition-opacity duration-500 ${
          mode === "story" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <section className="h-screen relative">
          <Hero />
        </section>

        <Explore />
      </div>
    </main>
  );
}