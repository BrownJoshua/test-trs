export type ProcessType = 'ONLY_VC' | 'ONLY_RT' | 'DOUBLE_PROCESS';

export type ProcessStage = 
  | 'INITIAL_INSPECTION'
  | 'BUFFING'
  | 'SKIVING_REPAIR'
  | 'BUILDING'
  | 'SECTION_CURE' // Specific to Double Process (Stage 1 RT spot cure)
  | 'CURING' // VC Chamber or RT Mold Press
  | 'FINAL_QC'
  | 'COMPLETED'
  | 'REJECTED';

export type UserRole = 'SUPERVISOR' | 'TECHNICIAN';

export type WorkshopStation = 
  | 'ALL'
  | 'INSPECTION'
  | 'BUFFING'
  | 'SKIVING_REPAIR'
  | 'BUILDING'
  | 'CURING'
  | 'FINAL_QC';

export interface TyreInjury {
  id: string;
  zone: 'CROWN' | 'SHOULDER_L' | 'SHOULDER_R' | 'SIDEWALL_L' | 'SIDEWALL_R' | 'BEAD_L' | 'BEAD_R' | 'INNERLINER';
  angleDeg: number; // 0 to 360 deg on tyre circumference
  description: string;
  depthMm: number;
  patchRecommended: string;
  repaired: boolean;
  notes?: string;
}

export interface StageLog {
  stage: ProcessStage;
  station: string;
  technicianName: string;
  timestamp: string;
  notes?: string;
  metrics?: Record<string, string | number | boolean>;
}

export interface JobCardMetrics {
  // Inspection
  initialTreadDepthMm?: number;
  casingAgeYears?: number;
  originalBeltCondition?: 'SOUND' | 'RUSTED' | 'EXPOSED' | 'SEPARATED';
  casingDefectsFound?: string[];

  // Buffing
  buffedCircumferenceMm?: number;
  targetCircumferenceMm?: number;
  buffedRadiusMm?: number;
  undertreadThicknessMm?: number;
  buffTextureRMA?: string; // RMA 3, RMA 4 (Buffing texture standard)

  // Skiving & Repair
  skivingInjuryCount?: number;
  cementsBatchNo?: string;
  patchesUsed?: { patchType: string; count: number }[];
  vulcanizingSolutionApplied?: boolean;

  // Building (Tread Application)
  cushionGumBatch?: string;
  cushionGumThicknessMm?: number;
  treadPattern?: string;
  treadRollLotNo?: string;
  treadCutLengthMm?: number;
  spliceQuality?: 'EXCELLENT' | 'GOOD' | 'RE-STITCHED';

  // Double Process Section Curing (Stage 1)
  sectionCureMachine?: string;
  sectionCureTempC?: number;
  sectionCureDurationMin?: number;

  // Curing (Chamber / Autoclave / Mold)
  chamberId?: string;
  curingBatchNo?: string;
  envelopeSerialNo?: string;
  envelopeLeakCheckPassed?: boolean;
  cureTempC?: number;
  curePressureBar?: number;
  cureDurationMinutes?: number;
  cureStartTime?: string;
  cureEndTime?: string;

  // Final QC
  finalTreadDepthMm?: number;
  shearographyPassed?: boolean;
  visualDefects?: string[];
  finalWeightKg?: number;
  balanceChecked?: boolean;
  qcInspectorName?: string;
  qcCertificateNo?: string;
  qcStatus?: 'PASSED' | 'REWORK_NEEDED' | 'REJECTED';
}

export interface JobCard {
  id: string;
  jobNo: string;
  customerName: string;
  customerPhone: string;
  fleetId?: string;
  vehicleNo?: string;
  
  // Tyre Spec
  tyreSerial: string;
  brand: string;
  size: string; // e.g. "295/80R22.5", "11R22.5", "10.00-20"
  casingType: 'RADIAL' | 'BIAS/NYLON';
  casingCondition: 'Grade A (1st Retread)' | 'Grade B (2nd Retread)' | 'Grade C (Major Repair Casing)';
  
  // Process Config
  processType: ProcessType;
  treadPattern: string;
  priority: 'NORMAL' | 'URGENT' | 'FLEET_CONTRACT';
  
  // Workflow state
  currentStage: ProcessStage;
  stageHistory: StageLog[];
  injuries: TyreInjury[];
  metrics: JobCardMetrics;
  
  status: 'IN_PROGRESS' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'SCRAP';
  rejectReason?: string;
  rejectStage?: ProcessStage;
  
  // Commercials & Dates
  estimatedPrice: number;
  createdAt: string;
  targetDeliveryDate: string;
  completedAt?: string;
}

export interface CuringBatch {
  id: string;
  batchNo: string;
  chamberName: string; // e.g., "Autoclave VC-01 (Capacity 18)" or "Mold Press RT-02"
  chamberType: 'AUTOCLAVE_VC' | 'HOT_MOLD_RT';
  processType: ProcessType;
  capacity: number;
  tyreIds: string[];
  status: 'QUEUED' | 'HEATING' | 'CURING' | 'COOLING' | 'COMPLETED';
  targetTempC: number;
  targetPressureBar: number;
  targetDurationMin: number;
  currentTempC?: number;
  currentPressureBar?: number;
  elapsedMinutes?: number;
  startedAt?: string;
  completedAt?: string;
  operatorName: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'TREAD_RUBBER' | 'CUSHION_GUM' | 'CEMENT' | 'REPAIR_PATCHES' | 'ENVELOPES' | 'CURING_BLADDERS' | 'ACCESSORIES';
  unit: string;
  stock: number;
  minThreshold: number;
  unitCost: number;
  lotNo: string;
  applicableProcess: 'ALL' | 'ONLY_VC' | 'ONLY_RT' | 'DOUBLE_PROCESS';
  specs?: string;
}

export interface TechnicianUser {
  id: string;
  name: string;
  code: string;
  avatarBg: string;
  assignedStation: WorkshopStation;
  shift: 'MORNING' | 'EVENING' | 'NIGHT';
  certifications: string[];
}
