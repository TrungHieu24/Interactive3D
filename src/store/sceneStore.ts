import { create } from "zustand";
import * as THREE from "three";

export type ViewMode = "story" | "xray";
export type CameraPreset = "frontLeft" | "frontRight" | "rearLeft" | "rearRight";

interface SceneState {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;

  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;

  activePart: string | null;
  activePartPoint: THREE.Vector3 | null;
  setActivePart: (part: string | null, point?: THREE.Vector3 | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  mode: "story",
  setMode: (mode) => set({ mode, activePart: null, activePartPoint: null }),

  cameraPreset: "frontLeft",
  setCameraPreset: (preset) => set({ cameraPreset: preset }),

  activePart: null,
  activePartPoint: null,
  setActivePart: (part, point = null) => set({ activePart: part, activePartPoint: point }),
}));