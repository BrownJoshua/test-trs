import { JobCard, CuringBatch, InventoryItem, TechnicianUser } from '../types';

export const INITIAL_TECHNICIANS: TechnicianUser[] = [
  {
    id: 'tech-1',
    name: 'Rajesh Kumar',
    code: 'TECH-01',
    avatarBg: 'bg-emerald-600',
    assignedStation: 'INSPECTION',
    shift: 'MORNING',
    certifications: ['NDT Level 2', 'Casing Shearography', 'Tread Wear Analysis']
  },
  {
    id: 'tech-2',
    name: 'Suresh Patil',
    code: 'TECH-02',
    avatarBg: 'bg-blue-600',
    assignedStation: 'BUFFING',
    shift: 'MORNING',
    certifications: ['CNC Buffer Operator', 'Crown Radius Profiling', 'RMA Texture Spec']
  },
  {
    id: 'tech-3',
    name: 'Vikram Singh',
    code: 'TECH-03',
    avatarBg: 'bg-amber-600',
    assignedStation: 'SKIVING_REPAIR',
    shift: 'MORNING',
    certifications: ['Radial Section Repair', 'Multi-Ply Skiving', 'Spot Vulcanization']
  },
  {
    id: 'tech-4',
    name: 'Anil Deshmukh',
    code: 'TECH-04',
    avatarBg: 'bg-indigo-600',
    assignedStation: 'BUILDING',
    shift: 'MORNING',
    certifications: ['Precured Tread Applicator', 'Cushion Extrusion', 'Splice Alignment']
  },
  {
    id: 'tech-5',
    name: 'Mohammed Tariq',
    code: 'TECH-05',
    avatarBg: 'bg-purple-600',
    assignedStation: 'CURING',
    shift: 'MORNING',
    certifications: ['Autoclave Safety Certified', 'Matrix Mold Press Specialist', 'Envelope Vacuum QA']
  },
  {
    id: 'tech-6',
    name: 'Dharmendra Sharma',
    code: 'TECH-06',
    avatarBg: 'bg-rose-600',
    assignedStation: 'FINAL_QC',
    shift: 'MORNING',
    certifications: ['Master QC Auditor', 'Hydrostatic Test Inspector', 'ISO 9001 Retread Auditor']
  }
];

export const INITIAL_JOB_CARDS: JobCard[] = [
  {
    id: 'jc-101',
    jobNo: 'JC-2026-0841',
    customerName: 'Highway Star Logistics',
    customerPhone: '+91 98201 44521',
    fleetId: 'HSL-FLEET-40',
    vehicleNo: 'MH-12-QZ-9102',
    tyreSerial: 'BS984210087',
    brand: 'Bridgestone R150',
    size: '295/80R22.5',
    casingType: 'RADIAL',
    casingCondition: 'Grade A (1st Retread)',
    processType: 'ONLY_VC',
    treadPattern: 'RIB Highway 15mm (Cold Precured)',
    priority: 'FLEET_CONTRACT',
    currentStage: 'CURING',
    status: 'IN_PROGRESS',
    estimatedPrice: 6200,
    createdAt: '2026-08-26T08:30:00Z',
    targetDeliveryDate: '2026-08-28',
    injuries: [
      {
        id: 'inj-1',
        zone: 'CROWN',
        angleDeg: 45,
        description: 'Nail puncture crown center, steel cords intact',
        depthMm: 4.5,
        patchRecommended: 'Radial Patch RP-12',
        repaired: true,
        notes: 'Skived clean, cemented & filled with uncured rope rubber'
      }
    ],
    metrics: {
      initialTreadDepthMm: 1.8,
      casingAgeYears: 2.1,
      originalBeltCondition: 'SOUND',
      casingDefectsFound: [],
      buffedCircumferenceMm: 3180,
      targetCircumferenceMm: 3178,
      buffedRadiusMm: 506,
      undertreadThicknessMm: 2.2,
      buffTextureRMA: 'RMA 3',
      skivingInjuryCount: 1,
      cementsBatchNo: 'CEM-2026-L8',
      patchesUsed: [{ patchType: 'RP-12', count: 1 }],
      vulcanizingSolutionApplied: true,
      cushionGumBatch: 'CG-880-AUG26',
      cushionGumThicknessMm: 1.2,
      treadRollLotNo: 'TR-PC-RIB-802',
      treadCutLengthMm: 3176,
      spliceQuality: 'EXCELLENT',
      chamberId: 'chamber-1',
      curingBatchNo: 'VC-BATCH-104',
      envelopeSerialNo: 'ENV-225-88',
      envelopeLeakCheckPassed: true,
      cureTempC: 104,
      curePressureBar: 6.2,
      cureDurationMinutes: 210,
      cureStartTime: '2026-08-27T08:00:00Z'
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 1',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-26T09:15:00Z',
        notes: 'Casing is intact. Sound innerliner, approved for Cold VC Process.'
      },
      {
        stage: 'BUFFING',
        station: 'CNC Buffer Station A',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-26T11:40:00Z',
        notes: 'Buffed to 3180mm circumference, texture clean RMA-3.'
      },
      {
        stage: 'SKIVING_REPAIR',
        station: 'Repair Station 2',
        technicianName: 'Vikram Singh',
        timestamp: '2026-08-26T14:10:00Z',
        notes: 'Puncture skived and plugged with stem plug + RP-12 radial patch.'
      },
      {
        stage: 'BUILDING',
        station: 'Builder Station 1',
        technicianName: 'Anil Deshmukh',
        timestamp: '2026-08-26T16:30:00Z',
        notes: 'Applied 1.2mm cushion gum and RIB 15mm precured tread. Stitching perfect.'
      }
    ]
  },
  {
    id: 'jc-102',
    jobNo: 'JC-2026-0842',
    customerName: 'Kaveri Transit & Mining',
    customerPhone: '+91 94432 11098',
    fleetId: 'KTM-MINING-07',
    vehicleNo: 'KA-01-MJ-4419',
    tyreSerial: 'AP771920031',
    brand: 'Apollo EnduTrax HD',
    size: '11.00-20',
    casingType: 'BIAS/NYLON',
    casingCondition: 'Grade B (2nd Retread)',
    processType: 'ONLY_RT',
    treadPattern: 'LUG Heavy Mining 20mm (Hot Mold)',
    priority: 'URGENT',
    currentStage: 'BUILDING',
    status: 'IN_PROGRESS',
    estimatedPrice: 7100,
    createdAt: '2026-08-26T10:00:00Z',
    targetDeliveryDate: '2026-08-27',
    injuries: [
      {
        id: 'inj-2',
        zone: 'SHOULDER_L',
        angleDeg: 120,
        description: 'Shoulder stone drilling injury, outer ply scraped',
        depthMm: 6.0,
        patchRecommended: 'Bias Patch BP-04',
        repaired: true,
        notes: 'Excavated cleanly, filled with raw extruded rubber compound'
      }
    ],
    metrics: {
      initialTreadDepthMm: 1.0,
      casingAgeYears: 3.0,
      originalBeltCondition: 'SOUND',
      casingDefectsFound: [],
      buffedCircumferenceMm: 3340,
      targetCircumferenceMm: 3335,
      buffedRadiusMm: 532,
      undertreadThicknessMm: 3.5,
      buffTextureRMA: 'RMA 4',
      skivingInjuryCount: 1,
      cementsBatchNo: 'CEM-HOT-2026',
      patchesUsed: [{ patchType: 'BP-04', count: 1 }],
      vulcanizingSolutionApplied: true
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 2',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-26T10:30:00Z',
        notes: 'Mining application casing. Bias construction approved for Only RT Hot Mold.'
      },
      {
        stage: 'BUFFING',
        station: 'Manual Rasp Buffer Station B',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-26T13:00:00Z',
        notes: 'Buffed to standard matrix mold circumference 3340mm.'
      },
      {
        stage: 'SKIVING_REPAIR',
        station: 'Repair Station 1',
        technicianName: 'Vikram Singh',
        timestamp: '2026-08-26T15:20:00Z',
        notes: 'Shoulder cut repaired with BP-04 and hot vulcanizing cement.'
      }
    ]
  },
  {
    id: 'jc-103',
    jobNo: 'JC-2026-0843',
    customerName: 'National Freightlines',
    customerPhone: '+91 97110 88200',
    fleetId: 'NFL-TRUCK-88',
    vehicleNo: 'DL-01-AA-3301',
    tyreSerial: 'MICH9931084',
    brand: 'Michelin X Multiway 3D',
    size: '315/80R22.5',
    casingType: 'RADIAL',
    casingCondition: 'Grade C (Major Repair Casing)',
    processType: 'DOUBLE_PROCESS',
    treadPattern: 'TRACTION Super 19mm (Double Process RT+VC)',
    priority: 'NORMAL',
    currentStage: 'SECTION_CURE',
    status: 'IN_PROGRESS',
    estimatedPrice: 8900,
    createdAt: '2026-08-26T11:15:00Z',
    targetDeliveryDate: '2026-08-29',
    injuries: [
      {
        id: 'inj-3',
        zone: 'SIDEWALL_R',
        angleDeg: 210,
        description: 'Major sidewall curb strike deep gouge, 3 steel cord exposed',
        depthMm: 8.5,
        patchRecommended: 'Heavy Duty Radial Section Patch RP-35',
        repaired: true,
        notes: 'Special multi-ply cord reinforced reinforcement. Requires Stage 1 Spot RT Cure.'
      },
      {
        id: 'inj-4',
        zone: 'CROWN',
        angleDeg: 330,
        description: 'Crown cut through breaker ply',
        depthMm: 5.0,
        patchRecommended: 'Crown Patch RP-20',
        repaired: true,
        notes: 'Pre-treated with vulcanizing chemical cement'
      }
    ],
    metrics: {
      initialTreadDepthMm: 2.0,
      casingAgeYears: 2.8,
      originalBeltCondition: 'SOUND',
      casingDefectsFound: [],
      buffedCircumferenceMm: 3385,
      targetCircumferenceMm: 3380,
      buffedRadiusMm: 540,
      undertreadThicknessMm: 2.5,
      buffTextureRMA: 'RMA 3',
      skivingInjuryCount: 2,
      cementsBatchNo: 'CEM-DP-HIGHBOND',
      patchesUsed: [
        { patchType: 'RP-35', count: 1 },
        { patchType: 'RP-20', count: 1 }
      ],
      vulcanizingSolutionApplied: true,
      sectionCureMachine: 'Spot Vulcanizer Press SV-03',
      sectionCureTempC: 150,
      sectionCureDurationMin: 45
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 1',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-26T11:45:00Z',
        notes: 'Severe sidewall cut identified. Mandatory Double Process (Stage 1 RT Section Cure + Stage 2 Cold VC).'
      },
      {
        stage: 'BUFFING',
        station: 'CNC Buffer Station A',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-26T14:40:00Z',
        notes: 'Careful buffing preserving undertread to 2.5mm.'
      },
      {
        stage: 'SKIVING_REPAIR',
        station: 'Master Repair Bay',
        technicianName: 'Vikram Singh',
        timestamp: '2026-08-26T17:00:00Z',
        notes: 'Section repair executed with RP-35 heavy duty patch. Loaded to Spot Curer.'
      }
    ]
  },
  {
    id: 'jc-104',
    jobNo: 'JC-2026-0844',
    customerName: 'Surya Bulk Carriers',
    customerPhone: '+91 98840 76543',
    fleetId: 'SBC-TANKER-12',
    vehicleNo: 'TN-09-CB-6721',
    tyreSerial: 'MRF44019283',
    brand: 'MRF Super Lug 50-Plus',
    size: '10.00-20',
    casingType: 'BIAS/NYLON',
    casingCondition: 'Grade A (1st Retread)',
    processType: 'ONLY_VC',
    treadPattern: 'LUG Heavy 18mm (Cold Precured)',
    priority: 'NORMAL',
    currentStage: 'FINAL_QC',
    status: 'IN_PROGRESS',
    estimatedPrice: 5800,
    createdAt: '2026-08-25T14:00:00Z',
    targetDeliveryDate: '2026-08-27',
    injuries: [],
    metrics: {
      initialTreadDepthMm: 1.5,
      casingAgeYears: 1.5,
      originalBeltCondition: 'SOUND',
      casingDefectsFound: [],
      buffedCircumferenceMm: 3290,
      targetCircumferenceMm: 3288,
      buffedRadiusMm: 524,
      undertreadThicknessMm: 3.0,
      buffTextureRMA: 'RMA 3',
      skivingInjuryCount: 0,
      cementsBatchNo: 'CEM-2026-L8',
      vulcanizingSolutionApplied: true,
      cushionGumBatch: 'CG-880-AUG26',
      cushionGumThicknessMm: 1.2,
      treadRollLotNo: 'TR-PC-LUG-901',
      treadCutLengthMm: 3285,
      spliceQuality: 'EXCELLENT',
      chamberId: 'chamber-1',
      curingBatchNo: 'VC-BATCH-103',
      envelopeSerialNo: 'ENV-200-44',
      envelopeLeakCheckPassed: true,
      cureTempC: 105,
      curePressureBar: 6.0,
      cureDurationMinutes: 210,
      cureStartTime: '2026-08-26T16:00:00Z',
      cureEndTime: '2026-08-26T19:30:00Z',
      finalTreadDepthMm: 18.0,
      shearographyPassed: true,
      visualDefects: [],
      finalWeightKg: 52.4,
      balanceChecked: true,
      qcInspectorName: 'Dharmendra Sharma',
      qcCertificateNo: 'QC-CERT-2026-0419',
      qcStatus: 'PASSED'
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 1',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-25T14:30:00Z',
        notes: 'Pristine 1st retread casing, zero defects.'
      },
      {
        stage: 'BUFFING',
        station: 'CNC Buffer Station A',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-25T16:00:00Z',
        notes: 'Uniform crown radius buffing.'
      },
      {
        stage: 'SKIVING_REPAIR',
        station: 'Repair Station 1',
        technicianName: 'Vikram Singh',
        timestamp: '2026-08-25T17:15:00Z',
        notes: 'Surface wire buffing only, no patch needed.'
      },
      {
        stage: 'BUILDING',
        station: 'Builder Station 1',
        technicianName: 'Anil Deshmukh',
        timestamp: '2026-08-26T10:00:00Z',
        notes: '18mm Heavy Lug precured tread applied.'
      },
      {
        stage: 'CURING',
        station: 'Autoclave Bay VC-01',
        technicianName: 'Mohammed Tariq',
        timestamp: '2026-08-26T19:30:00Z',
        notes: 'Cured 210 mins @ 105C, 6 bar. De-enveloped clean.'
      }
    ]
  },
  {
    id: 'jc-105',
    jobNo: 'JC-2026-0845',
    customerName: 'BlueDart Express Intra',
    customerPhone: '+91 99300 22119',
    fleetId: 'BD-EXPRESS-19',
    vehicleNo: 'KA-05-AA-8812',
    tyreSerial: 'GY55019281',
    brand: 'Goodyear Marathon LHS',
    size: '295/80R22.5',
    casingType: 'RADIAL',
    casingCondition: 'Grade A (1st Retread)',
    processType: 'ONLY_VC',
    treadPattern: 'RIB Highway 15mm (Cold Precured)',
    priority: 'FLEET_CONTRACT',
    currentStage: 'COMPLETED',
    status: 'READY_FOR_DELIVERY',
    estimatedPrice: 6200,
    createdAt: '2026-08-24T09:00:00Z',
    targetDeliveryDate: '2026-08-26',
    completedAt: '2026-08-26T18:00:00Z',
    injuries: [],
    metrics: {
      initialTreadDepthMm: 2.1,
      buffedCircumferenceMm: 3182,
      targetCircumferenceMm: 3180,
      cureTempC: 104,
      curePressureBar: 6.2,
      cureDurationMinutes: 210,
      finalTreadDepthMm: 15.2,
      finalWeightKg: 49.8,
      qcInspectorName: 'Dharmendra Sharma',
      qcCertificateNo: 'QC-CERT-2026-0415',
      qcStatus: 'PASSED',
      shearographyPassed: true,
      balanceChecked: true
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 1',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-24T09:30:00Z',
        notes: 'Grade A Casing Approved.'
      },
      {
        stage: 'BUFFING',
        station: 'CNC Buffer Station A',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-24T11:30:00Z',
        notes: 'Buffed to spec.'
      },
      {
        stage: 'BUILDING',
        station: 'Builder Station 1',
        technicianName: 'Anil Deshmukh',
        timestamp: '2026-08-24T15:00:00Z',
        notes: 'Tread applied with 1.2mm cushion.'
      },
      {
        stage: 'CURING',
        station: 'Autoclave Bay VC-01',
        technicianName: 'Mohammed Tariq',
        timestamp: '2026-08-25T12:00:00Z',
        notes: 'VC Chamber cured successfully.'
      },
      {
        stage: 'FINAL_QC',
        station: 'Final QC Bay',
        technicianName: 'Dharmendra Sharma',
        timestamp: '2026-08-26T17:45:00Z',
        notes: 'Passed high pressure test and dynamic balancing. Tagged for delivery.'
      }
    ]
  },
  {
    id: 'jc-106',
    jobNo: 'JC-2026-0846',
    customerName: 'Deccan Cargo Movers',
    customerPhone: '+91 98450 67123',
    fleetId: 'DCM-FLEET-03',
    vehicleNo: 'TS-07-UA-5520',
    tyreSerial: 'JK11894002',
    brand: 'JK Tyre Jetsteel JDH5',
    size: '10.00-20',
    casingType: 'RADIAL',
    casingCondition: 'Grade C (Major Repair Casing)',
    processType: 'ONLY_VC',
    treadPattern: 'LUG Heavy 18mm (Cold Precured)',
    priority: 'NORMAL',
    currentStage: 'REJECTED',
    status: 'SCRAP',
    rejectReason: 'Severe belt package ply separation & innerliner porous cracking detected during buffing',
    rejectStage: 'BUFFING',
    estimatedPrice: 0,
    createdAt: '2026-08-26T08:00:00Z',
    targetDeliveryDate: '2026-08-28',
    injuries: [],
    metrics: {
      initialTreadDepthMm: 1.2,
      casingDefectsFound: ['Crown separation hidden', 'Innerliner rubber porosity']
    },
    stageHistory: [
      {
        stage: 'INITIAL_INSPECTION',
        station: 'Inspection Bay 1',
        technicianName: 'Rajesh Kumar',
        timestamp: '2026-08-26T08:30:00Z',
        notes: 'Visual appearance acceptable, flagged for buffing check.'
      },
      {
        stage: 'BUFFING',
        station: 'CNC Buffer Station A',
        technicianName: 'Suresh Patil',
        timestamp: '2026-08-26T10:15:00Z',
        notes: 'During rasping, top belt delamination and rusted cord exposed across 40cm. Scrapped per safety norms.'
      }
    ]
  },
  {
    id: 'jc-107',
    jobNo: 'JC-2026-0847',
    customerName: 'Reddy Earthmovers & Tipper',
    customerPhone: '+91 99887 66554',
    fleetId: 'RET-DUMPER-09',
    vehicleNo: 'AP-21-TX-9011',
    tyreSerial: 'CONT908123',
    brand: 'Continental HDR2 Heavy',
    size: '12.00R20',
    casingType: 'RADIAL',
    casingCondition: 'Grade B (2nd Retread)',
    processType: 'DOUBLE_PROCESS',
    treadPattern: 'MIXED SERVICE Off-Road 22mm (Double Process RT+VC)',
    priority: 'URGENT',
    currentStage: 'INITIAL_INSPECTION',
    status: 'IN_PROGRESS',
    estimatedPrice: 9400,
    createdAt: '2026-08-27T01:30:00Z',
    targetDeliveryDate: '2026-08-30',
    injuries: [
      {
        id: 'inj-5',
        zone: 'SHOULDER_R',
        angleDeg: 90,
        description: 'Deep rock slice through shoulder rubber into 2nd ply',
        depthMm: 9.0,
        patchRecommended: 'Heavy Radial Section Patch RP-30',
        repaired: false
      }
    ],
    metrics: {
      initialTreadDepthMm: 2.4,
      casingAgeYears: 2.2,
      originalBeltCondition: 'SOUND'
    },
    stageHistory: []
  }
];

export const INITIAL_CURING_BATCHES: CuringBatch[] = [
  {
    id: 'batch-vc-104',
    batchNo: 'VC-BATCH-104',
    chamberName: 'Autoclave Chamber VC-01 (Capacity: 18 Tyres)',
    chamberType: 'AUTOCLAVE_VC',
    processType: 'ONLY_VC',
    capacity: 18,
    tyreIds: ['jc-101'],
    status: 'CURING',
    targetTempC: 105,
    targetPressureBar: 6.2,
    targetDurationMin: 210,
    currentTempC: 104,
    currentPressureBar: 6.1,
    elapsedMinutes: 145,
    startedAt: '2026-08-27T08:00:00Z',
    operatorName: 'Mohammed Tariq'
  },
  {
    id: 'batch-rt-008',
    batchNo: 'RT-MOLD-008',
    chamberName: 'Segmented Matrix Mold Press RT-02',
    chamberType: 'HOT_MOLD_RT',
    processType: 'ONLY_RT',
    capacity: 2,
    tyreIds: [],
    status: 'QUEUED',
    targetTempC: 152,
    targetPressureBar: 14.5,
    targetDurationMin: 90,
    currentTempC: 30,
    currentPressureBar: 0,
    elapsedMinutes: 0,
    operatorName: 'Mohammed Tariq'
  },
  {
    id: 'batch-dp-003',
    batchNo: 'DP-AUTOCLAVE-003',
    chamberName: 'Dual-Stage Autoclave VC-02',
    chamberType: 'AUTOCLAVE_VC',
    processType: 'DOUBLE_PROCESS',
    capacity: 12,
    tyreIds: [],
    status: 'QUEUED',
    targetTempC: 108,
    targetPressureBar: 6.5,
    targetDurationMin: 230,
    currentTempC: 28,
    currentPressureBar: 0,
    elapsedMinutes: 0,
    operatorName: 'Mohammed Tariq'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    code: 'TR-RIB-295-15',
    name: 'Precured Tread Roll - RIB Highway 15mm (Width: 230mm)',
    category: 'TREAD_RUBBER',
    unit: 'Meters',
    stock: 184,
    minThreshold: 40,
    unitCost: 1100,
    lotNo: 'TR-PC-RIB-802',
    applicableProcess: 'ONLY_VC',
    specs: 'High mileage compound, 15mm depth, for 295/80R22.5 & 11R22.5'
  },
  {
    id: 'inv-2',
    code: 'TR-LUG-1000-18',
    name: 'Precured Tread Roll - LUG Heavy Traction 18mm (Width: 215mm)',
    category: 'TREAD_RUBBER',
    unit: 'Meters',
    stock: 96,
    minThreshold: 30,
    unitCost: 1250,
    lotNo: 'TR-PC-LUG-901',
    applicableProcess: 'ONLY_VC',
    specs: 'Anti-chip off-road compound, 18mm depth, for 10.00-20'
  },
  {
    id: 'inv-3',
    code: 'CG-ROLL-1.2',
    name: 'Unvulcanized Cushion Gum Roll 1.2mm x 230mm',
    category: 'CUSHION_GUM',
    unit: 'Kilograms',
    stock: 320,
    minThreshold: 60,
    unitCost: 480,
    lotNo: 'CG-880-AUG26',
    applicableProcess: 'ALL',
    specs: 'Tack-retaining bonding gum for precured & double process'
  },
  {
    id: 'inv-4',
    code: 'RT-CAMELBACK-HD',
    name: 'Raw Rubber Camelback Slab / Extrusion Compound',
    category: 'TREAD_RUBBER',
    unit: 'Kilograms',
    stock: 450,
    minThreshold: 100,
    unitCost: 320,
    lotNo: 'RT-RAW-771',
    applicableProcess: 'ONLY_RT',
    specs: 'Hot mold vulcanization compound, high tensile abrasion resist'
  },
  {
    id: 'inv-5',
    code: 'CEM-VULC-20L',
    name: 'Fast-Dry Vulcanizing Cement Solution',
    category: 'CEMENT',
    unit: 'Liters',
    stock: 65,
    minThreshold: 15,
    unitCost: 850,
    lotNo: 'CEM-2026-L8',
    applicableProcess: 'ALL',
    specs: 'Chemical & heat activator cement for buffed casing & skives'
  },
  {
    id: 'inv-6',
    code: 'PATCH-RP-12',
    name: 'Radial Repair Patch RP-12 (Crown 1-Ply)',
    category: 'REPAIR_PATCHES',
    unit: 'Pieces',
    stock: 82,
    minThreshold: 25,
    unitCost: 180,
    lotNo: 'P-RP12-33',
    applicableProcess: 'ALL',
    specs: 'Nail hole and minor crown cut repair'
  },
  {
    id: 'inv-7',
    code: 'PATCH-RP-35',
    name: 'Heavy Duty Radial Section Repair Patch RP-35 (Sidewall/Shoulder 4-Ply)',
    category: 'REPAIR_PATCHES',
    unit: 'Pieces',
    stock: 38,
    minThreshold: 12,
    unitCost: 620,
    lotNo: 'P-RP35-90',
    applicableProcess: 'DOUBLE_PROCESS',
    specs: 'For severe cord damage in Double Process retreading'
  },
  {
    id: 'inv-8',
    code: 'ENV-OUTER-225',
    name: 'Outer Curing Envelope 295/80R22.5 (Silicone/Rubber)',
    category: 'ENVELOPES',
    unit: 'Units',
    stock: 24,
    minThreshold: 8,
    unitCost: 3200,
    lotNo: 'ENV-SIL-2026',
    applicableProcess: 'ONLY_VC',
    specs: 'Rated for 60-80 autoclave cycles at 110C'
  },
  {
    id: 'inv-9',
    code: 'BLAD-MOLD-20',
    name: 'Hot Matrix Curing Bladder 10.00-20 / 11.00-20',
    category: 'CURING_BLADDERS',
    unit: 'Units',
    stock: 8,
    minThreshold: 3,
    unitCost: 4500,
    lotNo: 'BLD-HT-102',
    applicableProcess: 'ONLY_RT',
    specs: 'High temperature 160C steam/hydraulic rated'
  }
];
