import Helmet from "../../components/Helmet/Helmet";
import CameraRig from "./CameraRig";
import { Environment, ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { useSceneStore } from "../../store/sceneStore";

export default function Experience() {
  const mode = useSceneStore((s) => s.mode);

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} castShadow />
      <Environment files="/hdri/studio.hdr" background={false} />

      <Float speed={mode === "story" ? 2 : 0} floatIntensity={mode === "story" ? 0.6 : 0} rotationIntensity={0}>
        <Helmet />
      </Float>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2} />

      {mode === "xray" && (
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={4}
        />
      )}
    </>
  );
}