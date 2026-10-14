import * as THREE from "three";
import { findPartByMeshName } from "../constants/partsData";
import { CATEGORY_COLORS, DEFAULT_GLASS_COLOR } from "../constants/categoryColors";

export interface GlassMaterialOptions {
  baseOpacity?: number;
  highlightOpacity?: number;
  emissiveIntensity?: number;
}

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function getOrCreateMaterial(
  colorHex: string,
  opacity: number,
  emissiveIntensity: number
): THREE.MeshStandardMaterial {
  const key = `${colorHex}_${opacity}_${emissiveIntensity}`;
  const cached = materialCache.get(key);
  if (cached) return cached;

  const color = new THREE.Color(colorHex);
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.3,
    metalness: 0,
    emissive: color,
    emissiveIntensity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  materialCache.set(key, material);
  return material;
}

export function applyGlassMaterial(
  scene: THREE.Object3D,
  options: GlassMaterialOptions = {}
): THREE.Object3D {
  const {
    baseOpacity = 0.14,
    highlightOpacity = 0.26,
    emissiveIntensity = 0.2,
  } = options;

  const cloned = scene.clone(true);
  let matchedCount = 0;

  cloned.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const part = findPartByMeshName(child.name);
    const isHighlighted = !!part;
    if (isHighlighted) matchedCount++;

    const colorHex = part
      ? CATEGORY_COLORS[part.category] ?? DEFAULT_GLASS_COLOR
      : DEFAULT_GLASS_COLOR;

    child.material = getOrCreateMaterial(
      colorHex,
      isHighlighted ? highlightOpacity : baseOpacity,
      isHighlighted ? emissiveIntensity * 1.1 : emissiveIntensity * 0.5
    );
  });

  console.log(`[glassMaterial] Đã tô màu ${matchedCount} mesh khớp với partsData.ts`);
  return cloned;
}