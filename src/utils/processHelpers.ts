import { ProcessType, ProcessStage } from '../types';

export const PROCESS_CONFIG: Record<ProcessType, {
  label: string;
  shortLabel: string;
  tagline: string;
  badgeColor: string;
  accentBg: string;
  accentBorder: string;
  stages: ProcessStage[];
  description: string;
  cureMethod: string;
  tempRange: string;
  pressureRange: string;
}> = {
  ONLY_VC: {
    label: 'Only VC (Vacuum Curing / Precured Cold Process)',
    shortLabel: 'Only VC',
    tagline: 'Precured Tread + Envelope Autoclave Chamber',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    accentBg: 'bg-blue-50 dark:bg-blue-950/30',
    accentBorder: 'border-blue-200 dark:border-blue-800',
    stages: [
      'INITIAL_INSPECTION',
      'BUFFING',
      'SKIVING_REPAIR',
      'BUILDING',
      'CURING',
      'FINAL_QC',
      'COMPLETED'
    ],
    description: 'Cold retreading process utilizing factory-cured precured tread rubber, unvulcanized cushion gum bonding layer, outer envelope vacuuming, and low-temperature autoclave chamber curing.',
    cureMethod: 'Vacuum Envelope in Autoclave Chamber',
    tempRange: '98°C – 110°C (208°F – 230°F)',
    pressureRange: '5.8 – 6.5 bar (85 – 95 psi)'
  },
  ONLY_RT: {
    label: 'Only RT (Hot Mold / Matrix Retreading)',
    shortLabel: 'Only RT',
    tagline: 'Raw Rubber Camelback + High Temp Mold Press',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    accentBg: 'bg-amber-50 dark:bg-amber-950/30',
    accentBorder: 'border-amber-200 dark:border-amber-800',
    stages: [
      'INITIAL_INSPECTION',
      'BUFFING',
      'SKIVING_REPAIR',
      'BUILDING',
      'CURING',
      'FINAL_QC',
      'COMPLETED'
    ],
    description: 'Hot retreading process applying uncured raw rubber (camelback slab/extrusion) onto the buffed casing and vulcanizing under high hydraulic pressure in a heated tread pattern matrix mold.',
    cureMethod: 'Segmented Matrix Hot Mold Press',
    tempRange: '145°C – 155°C (293°F – 311°F)',
    pressureRange: '12.0 – 16.0 bar (175 – 230 psi)'
  },
  DOUBLE_PROCESS: {
    label: 'Double Process (Dual Stage: Hot Section RT + Cold VC)',
    shortLabel: 'Double Process',
    tagline: 'Stage 1 RT Spot Cure + Stage 2 Precured VC Chamber',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    accentBg: 'bg-purple-50 dark:bg-purple-950/30',
    accentBorder: 'border-purple-200 dark:border-purple-800',
    stages: [
      'INITIAL_INSPECTION',
      'BUFFING',
      'SKIVING_REPAIR',
      'SECTION_CURE', // Stage 1 RT Cure for heavy structural repair
      'BUILDING',
      'CURING', // Stage 2 VC Chamber Cure for precured tread
      'FINAL_QC',
      'COMPLETED'
    ],
    description: 'Specialized dual-phase engineering for heavily injured casings: Phase 1 executes hot vulcanization (RT) of multi-ply section repairs, followed by Phase 2 full precured tread building and vacuum autoclave chamber curing (VC).',
    cureMethod: 'Dual Stage: Hot Spot Press (150°C) + VC Chamber (105°C)',
    tempRange: 'Stage 1: 150°C | Stage 2: 105°C',
    pressureRange: 'Stage 1: Localized Clamp | Stage 2: 6.2 bar'
  }
};

export const STAGE_META: Record<ProcessStage, {
  label: string;
  short: string;
  stationName: string;
  order: number;
  iconName: string;
  color: string;
  desc: string;
}> = {
  INITIAL_INSPECTION: {
    label: 'Initial Casing & NDT Inspection',
    short: 'Inspection',
    stationName: 'Inspection Bay',
    order: 1,
    iconName: 'Search',
    color: 'emerald',
    desc: 'Verify ply separation, bead integrity, crown injuries & process suitability'
  },
  BUFFING: {
    label: 'Crown Buffing & Rasping',
    short: 'Buffing',
    stationName: 'CNC Buffer Station',
    order: 2,
    iconName: 'Disc',
    color: 'blue',
    desc: 'Buff old tread to exact crown radius and target circumference with RMA texture'
  },
  SKIVING_REPAIR: {
    label: 'Skiving, Injury Prep & Patching',
    short: 'Skiving & Patch',
    stationName: 'Skiving & Repair Bay',
    order: 3,
    iconName: 'Wrench',
    color: 'amber',
    desc: 'Excavate rust/stone cuts, apply vulcanizing cement, stem plugs & radial patches'
  },
  SECTION_CURE: {
    label: 'Stage 1: RT Section Vulcanization',
    short: 'Section RT Cure',
    stationName: 'Hot Spot Vulcanizer',
    order: 4,
    iconName: 'Flame',
    color: 'rose',
    desc: 'Cure deep sidewall/crown section repair patch with hot vulcanizing press before tread building'
  },
  BUILDING: {
    label: 'Cushion Gum & Tread Building',
    short: 'Tread Building',
    stationName: 'Builder Station',
    order: 5,
    iconName: 'Layers',
    color: 'indigo',
    desc: 'Extrude 1.2mm cushion gum bonding layer and apply precured/raw tread rubber with stitched splice'
  },
  CURING: {
    label: 'Curing & Vulcanization',
    short: 'Curing Chamber',
    stationName: 'Autoclave / Mold Bay',
    order: 6,
    iconName: 'Gauge',
    color: 'purple',
    desc: 'Envelope vacuum seal & autoclave chamber (VC) or matrix mold press (RT) curing cycle'
  },
  FINAL_QC: {
    label: 'Final QC & Pressure Release',
    short: 'Final QC',
    stationName: 'QC & Dispatch Bay',
    order: 7,
    iconName: 'ShieldCheck',
    color: 'teal',
    desc: 'Hydrostatic pressure test, shearography, bead seat audit, dynamic balance & certificate tag'
  },
  COMPLETED: {
    label: 'Completed & Ready for Delivery',
    short: 'Ready / Done',
    stationName: 'Dispatch Staging',
    order: 8,
    iconName: 'CheckCircle2',
    color: 'green',
    desc: 'Job complete. Tagged with retread warranty certificate and ready for billing/dispatch'
  },
  REJECTED: {
    label: 'Rejected / Scrapped Casing',
    short: 'Scrapped',
    stationName: 'Quarantine Bay',
    order: 9,
    iconName: 'AlertTriangle',
    color: 'red',
    desc: 'Casing failed safety thresholds (ply separation, bead ring fracture, or excessive innerliner damage)'
  }
};

export function getNextStage(processType: ProcessType, currentStage: ProcessStage): ProcessStage | null {
  const stages = PROCESS_CONFIG[processType].stages;
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= stages.length - 1) {
    return null;
  }
  return stages[currentIndex + 1];
}

export function getPreviousStage(processType: ProcessType, currentStage: ProcessStage): ProcessStage | null {
  const stages = PROCESS_CONFIG[processType].stages;
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex <= 0) {
    return null;
  }
  return stages[currentIndex - 1];
}

export function getStageProgressPercent(processType: ProcessType, currentStage: ProcessStage): number {
  if (currentStage === 'COMPLETED') return 100;
  if (currentStage === 'REJECTED') return 100;
  const stages = PROCESS_CONFIG[processType].stages;
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex === -1) return 0;
  return Math.round(((currentIndex + 1) / stages.length) * 100);
}
