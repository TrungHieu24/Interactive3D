import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Experience from "./Experience";

export default function Scene() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 35 }}>
      <color attach="background" args={["#05070D"]} />
      <Experience />
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}