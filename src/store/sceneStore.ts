import { create } from "zustand";
import * as THREE from "three";

export type ViewMode = "story" | "xray";
export type CameraPreset = "frontLeft" | "frontRight" | "rearLeft" | "rearRight";

interface SceneState {
  helmetRef: THREE.Group | null;
  setHelmet: (ref: THREE.Group) => void;

  mode: ViewMode;
  setMode: (mode: ViewMode) => void;

  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;

  activePart: string | null;
  setActivePart: (part: string | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  helmetRef: null,
  setHelmet: (ref) => set({ helmetRef: ref }),

  mode: "story",
  setMode: (mode) => set({ mode, activePart: null }),

  cameraPreset: "frontLeft",
  setCameraPreset: (preset) => set({ cameraPreset: preset }),

  activePart: null,
  setActivePart: (part) => set({ activePart: part }),
}));