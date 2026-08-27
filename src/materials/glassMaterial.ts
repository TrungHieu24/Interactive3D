import * as THREE from "three";
import { findPartByMeshName } from "../constants/partsData";
import { CATEGORY_COLORS, DEFAULT_GLASS_COLOR } from "../constants/categoryColors";

export interface GlassMaterialOptions {
  baseOpacity?: number;
  highlightOpacity?: number;
  emissiveIntensity?: number;
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

    const colorHex = part ? CATEGORY_COLORS[part.category] ?? DEFAULT_GLASS_COLOR : DEFAULT_GLASS_COLOR;
    const color = new THREE.Color(colorHex);

    // Đổi từ MeshPhysicalMaterial (transmission/clearcoat rất nặng)
    // sang MeshStandardMaterial (nhẹ hơn nhiều lần, vẫn đủ trong suốt + phát sáng)
    child.material = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: isHighlighted ? highlightOpacity : baseOpacity,
      roughness: 0.3,
      metalness: 0,
      emissive: color,
      emissiveIntensity: isHighlighted ? emissiveIntensity * 1.1 : emissiveIntensity * 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  });

  console.log(`[glassMaterial] Đã tô màu ${matchedCount} mesh khớp với partsData.ts`);
  return cloned;
}