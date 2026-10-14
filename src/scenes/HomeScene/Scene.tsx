import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Experience from "./Experience";
import { BLOOM_CONFIG } from "../../constants/postProcessing";
import { useSceneStore } from "../../store/sceneStore";

export default function Scene() {
  const mode = useSceneStore((s) => s.mode);

  return (
    <Canvas
      shadows={mode === "story"}   
      dpr={mode === "xray" ? 1 : [1, 2]}  
      camera={{ position: [0, 0, 4], fov: 35 }}
    >
      <color attach="background" args={["#05070D"]} />
      <Experience />
      <EffectComposer multisampling={0}>
        <Bloom {...BLOOM_CONFIG} />
      </EffectComposer>
    </Canvas>
  );
}