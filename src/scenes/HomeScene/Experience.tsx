import Helmet from "../../components/Helmet/Helmet";
import CameraRig from "./CameraRig";
import {Environment,ContactShadows,Float} from "@react-three/drei";

export default function Experience(){

return(
<>
<CameraRig/>

<ambientLight intensity={0.25}/>

<directionalLight position={[4,6,4]} intensity={1.8} castShadow/>

<Environment files="/hdri/studio.hdr" background={false}/>

<Float speed={2} floatIntensity={0.6} rotationIntensity={0}>
<Helmet/>
</Float>

<ContactShadows position={[0,-1.2,0]} opacity={0.6} scale={10} blur={2}/>

</>
)

}