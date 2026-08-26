import * as THREE from "three";
import { findPartByMeshName } from "../constants/partsData";
import { CATEGORY_COLORS, DEFAULT_GLASS_COLOR } from "../constants/categoryColors";

export interface GlassMaterialOptions {
  baseOpacity?: number;
  highlightOpacity?: number;
  emissiveIntensity?: number;
}

function resolveObjectName(mesh: THREE.Object3D): string {
  let node: THREE.Object3D | null = mesh;
  let depth = 0;

  while (node && depth < 3) {
    const looksGeneric = /^(mesh|object|node)[_\d]*$/i.test(node.name ?? "");
    if (node.name && !looksGeneric) return node.name;
    node = node.parent;
    depth++;
  }

  return mesh.name;
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

    const resolvedName = resolveObjectName(child);
    const part = findPartByMeshName(resolvedName);
    const isHighlighted = !!part;
    if (isHighlighted) matchedCount++;

    const colorHex = part ? CATEGORY_COLORS[part.category] ?? DEFAULT_GLASS_COLOR : DEFAULT_GLASS_COLOR;
    const color = new THREE.Color(colorHex);

    child.material = new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: isHighlighted ? highlightOpacity : baseOpacity,
      transmission: isHighlighted ? 0.35 : 0.55,
      thickness: 0.3,
      roughness: isHighlighted ? 0.1 : 0.25,
      metalness: 0,
      clearcoat: isHighlighted ? 0.15 : 0,        
      clearcoatRoughness: 0.2,
      emissive: color,
      emissiveIntensity: isHighlighted ? emissiveIntensity * 4 : emissiveIntensity * 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  });

  console.log(`[glassMaterial] Đã tô màu ${matchedCount} mesh khớp với partsData.ts`);

  return cloned;
}