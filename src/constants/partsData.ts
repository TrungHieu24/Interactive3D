export interface PartInfo {
  id: string;
  meshNames: string[];
  category: string;
  title: string;
  tags: string[];
  description: string;
  connectedSystems: string[];
}

export const PARTS_DATA: PartInfo[] = [
  {
    id: "block",
    meshNames: ["EngineBlock_"],
    category: "STRUCTURE",
    title: "V6 Cylinder Block",
    tags: ["Aluminum alloy", "6-cylinder V-config"],
    description:
      "Khối động cơ chính chứa 6 xi-lanh bố trí hình chữ V, là bộ khung chịu lực cho toàn bộ hệ thống piston, trục khuỷu.",
    connectedSystems: ["Crankshaft", "Pistons & Rods", "Cylinder Head"],
  },
  {
    id: "crankshaft",
    meshNames: ["CrankShaft"],
    category: "BOTTOM END",
    title: "Crankshaft",
    tags: ["Forged steel", "6-throw design"],
    description:
      "Trục khuỷu chuyển đổi chuyển động lên-xuống của piston thành chuyển động quay, truyền công suất ra hộp số.",
    connectedSystems: ["Pistons & Rods", "Cylinder Block"],
  },
  {
    id: "pistons",
    meshNames: ["Piston-", "PistonRod-"],
    category: "BOTTOM END",
    title: "Pistons & Connecting Rods",
    tags: ["6x pistons", "Forged rods"],
    description:
      "6 piston di chuyển trong lòng xi-lanh, truyền lực nén qua tay biên xuống trục khuỷu.",
    connectedSystems: ["Crankshaft", "Cylinder Block"],
  },
  {
    id: "head",
    meshNames: ["EngineHead_"],
    category: "STRUCTURE",
    title: "Cylinder Head",
    tags: ["Dual-cam", "Integrated valvetrain"],
    description:
      "Nắp máy chứa toàn bộ hệ thống van nạp/xả và trục cam, điều tiết luồng khí ra vào từng xi-lanh.",
    connectedSystems: ["Intake System", "Exhaust System", "Cylinder Block"],
  },
  {
    id: "intake",
    meshNames: ["IntakeValve-", "IntakeCamL", "IntakeCamR", "IntakeSpring-"],
    category: "VALVETRAIN",
    title: "Intake Valvetrain",
    tags: ["6x intake valves", "Dual camshaft L/R"],
    description:
      "Cụm van nạp, trục cam và lò xo hồi vị — mở đúng thời điểm để hỗn hợp khí/nhiên liệu đi vào buồng đốt.",
    connectedSystems: ["Cylinder Head", "Manifold & Piping"],
  },
  {
    id: "exhaust",
    meshNames: ["ExhaustValve-", "ExhaustCamL", "ExhaustCamR", "ExhaustSpring-"],
    category: "VALVETRAIN",
    title: "Exhaust Valvetrain",
    tags: ["6x exhaust valves", "Dual camshaft L/R"],
    description:
      "Cụm van xả, trục cam và lò xo hồi vị — đẩy khí thải sau đốt cháy ra khỏi buồng đốt.",
    connectedSystems: ["Cylinder Head", "Turbocharger"],
  },
  {
    id: "turbo",
    meshNames: ["TurboCaseL", "TurboCaseR", "CompressorTurbineL", "CompressorTurbineR"],
    category: "FORCED INDUCTION",
    title: "Twin-Turbo System",
    tags: ["Dual turbocharger", "L/R independent"],
    description:
      "2 turbo tăng áp độc lập cho mỗi dãy xi-lanh, tận dụng khí thải để nén thêm khí nạp.",
    connectedSystems: ["Exhaust Valvetrain", "Cooling System"],
  },
  {
    id: "cooling",
    meshNames: ["IntercoolerRadiator_", "RadiatorPipe"],
    category: "COOLING",
    title: "Intercooler & Radiator",
    tags: ["Charge air cooling", "Closed-loop piping"],
    description:
      "Làm mát khí nạp sau khi qua turbo và giải nhiệt tổng thể cho khối động cơ.",
    connectedSystems: ["Twin-Turbo System"],
  },
  {
    id: "manifold",
    meshNames: ["Manifold_", "Pipe_"],
    category: "AIRFLOW",
    title: "Intake Manifold & Piping",
    tags: ["Air distribution", "Direct piping"],
    description:
      "Hệ thống ống dẫn phân phối khí nạp đều tới từng xi-lanh sau khi qua intercooler.",
    connectedSystems: ["Intake Valvetrain", "Intercooler & Radiator"],
  },
];

export function findPartByMeshName(meshName: string): PartInfo | undefined {
  return PARTS_DATA.find((p) =>
    p.meshNames.some((n) => meshName.toLowerCase().includes(n.toLowerCase()))
  );
}