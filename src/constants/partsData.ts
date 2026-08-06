export interface PartInfo {
  id: string;
  meshNames: string[]; // ⚠️ SỬA theo tên mesh thật trong file .glb của bạn
  category: string;
  title: string;
  tags: string[];
  description: string;
  connectedSystems: string[];
}

export const PARTS_DATA: PartInfo[] = [
  {
    id: "visor",
    meshNames: ["Visor", "Glass", "visor_low"],
    category: "OPTICS",
    title: "Anti-Fog Visor System",
    tags: ["Polycarbonate", "UV400 coating"],
    description:
      "Lớp kính chống mờ giúp tầm nhìn rõ trong mọi điều kiện thời tiết, phủ lớp chống UV bảo vệ mắt khỏi tia cực tím.",
    connectedSystems: ["Shell", "Ventilation"],
  },
  {
    id: "shell",
    meshNames: ["Shell", "Outer_Shell", "body"],
    category: "STRUCTURE",
    title: "Composite Outer Shell",
    tags: ["Carbon fiber", "Impact resistant"],
    description:
      "Lớp vỏ ngoài chịu lực chính, phân tán năng lượng va chạm ra toàn bộ diện tích mũ, giảm chấn động truyền tới đầu.",
    connectedSystems: ["Inner Padding", "Visor"],
  },
  {
    id: "vents",
    meshNames: ["Vents", "Vent", "airflow"],
    category: "AIRFLOW",
    title: "Dynamic Ventilation Channels",
    tags: ["Active airflow", "Heat dissipation"],
    description:
      "Hệ thống khe thông gió dẫn không khí xuyên qua lớp đệm trong, giữ đầu luôn mát khi vận hành thời gian dài.",
    connectedSystems: ["Shell", "Inner Padding"],
  },
];

export function findPartByMeshName(meshName: string): PartInfo | undefined {
  return PARTS_DATA.find((p) =>
    p.meshNames.some((n) => meshName.toLowerCase().includes(n.toLowerCase()))
  );
}