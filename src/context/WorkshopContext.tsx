import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  JobCard, 
  CuringBatch, 
  InventoryItem, 
  TechnicianUser, 
  UserRole, 
  WorkshopStation, 
  ProcessType, 
  ProcessStage, 
  TyreInjury, 
  StageLog, 
  JobCardMetrics 
} from '../types';
import { 
  INITIAL_JOB_CARDS, 
  INITIAL_CURING_BATCHES, 
  INITIAL_INVENTORY, 
  INITIAL_TECHNICIANS 
} from '../data/initialData';
import { getNextStage, STAGE_META } from '../utils/processHelpers';

interface WorkshopContextType {
  // Role & Station
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeStation: WorkshopStation;
  setActiveStation: (station: WorkshopStation) => void;
  activeTechnician: TechnicianUser;
  setActiveTechnician: (tech: TechnicianUser) => void;
  technicians: TechnicianUser[];
  
  // Data
  jobCards: JobCard[];
  curingBatches: CuringBatch[];
  inventory: InventoryItem[];
  
  // Filtering & Selection
  selectedJobId: string | null;
  selectedJobCard: JobCard | null;
  setSelectedJobId: (id: string | null) => void;
  processFilter: 'ALL' | ProcessType;
  setProcessFilter: (filter: 'ALL' | ProcessType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Active Views
  activeModal: string | null;
  openModal: (modalName: string, jobId?: string) => void;
  closeModal: () => void;
  
  // Job Card Actions
  createJobCard: (data: Omit<JobCard, 'id' | 'createdAt' | 'stageHistory' | 'injuries' | 'status' | 'metrics' | 'jobNo'> & { initialNotes?: string }) => JobCard;
  updateJobCard: (id: string, updates: Partial<JobCard>) => void;
  advanceJobStage: (jobId: string, logNotes?: string, metricsUpdates?: Partial<JobCardMetrics>) => boolean;
  rollbackJobStage?: (jobId: string, targetStage: ProcessStage, reason: string) => void;
  rejectJobCard: (jobId: string, reason: string, stage: ProcessStage) => void;
  markDelivered: (jobId: string) => void;
  
  // Injuries
  addInjury: (jobId: string, injury: Omit<TyreInjury, 'id'>) => void;
  updateInjury: (jobId: string, injuryId: string, updates: Partial<TyreInjury>) => void;
  deleteInjury: (jobId: string, injuryId: string) => void;
  
  // Curing Batches
  createCuringBatch: (batchData: Omit<CuringBatch, 'id' | 'batchNo'>) => CuringBatch;
  addTyreToBatch: (batchId: string, jobId: string) => void;
  removeTyreFromBatch: (batchId: string, jobId: string) => void;
  startCuringBatch: (batchId: string) => void;
  completeCuringBatch: (batchId: string) => void;
  
  // Inventory Actions
  updateInventoryStock: (id: string, newStock: number) => void;
  restockItem: (id: string, qty: number, lotNo?: string) => void;
  
  // Utilities
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const STORAGE_KEYS = {
  JOBS: 'tyre_erp_jobs_v1',
  BATCHES: 'tyre_erp_batches_v1',
  INVENTORY: 'tyre_erp_inventory_v1',
  ROLE: 'tyre_erp_role_v1',
  STATION: 'tyre_erp_station_v1',
  TECH: 'tyre_erp_tech_v1'
};

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [jobCards, setJobCards] = useState<JobCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_JOB_CARDS;
  });

  const [curingBatches, setCuringBatches] = useState<CuringBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CURING_BATCHES;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_INVENTORY;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved === 'TECHNICIAN' || saved === 'SUPERVISOR') return saved;
    } catch {
      // ignore
    }
    return 'SUPERVISOR';
  });

  const [activeStation, setActiveStation] = useState<WorkshopStation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATION) as WorkshopStation;
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'ALL';
  });

  const [technicians] = useState<TechnicianUser[]>(INITIAL_TECHNICIANS);

  const [activeTechnician, setActiveTechnician] = useState<TechnicianUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TECH);
      if (saved) {
        const found = INITIAL_TECHNICIANS.find(t => t.id === saved);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return INITIAL_TECHNICIANS[0];
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [processFilter, setProcessFilter] = useState<'ALL' | ProcessType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobCards));
    } catch {
      // ignore
    }
  }, [jobCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(curingBatches));
    } catch {
      // ignore
    }
  }, [curingBatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch {
      // ignore
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
    } catch {
      // ignore
    }
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATION, activeStation);
    } catch {
      // ignore
    }
  }, [activeStation]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TECH, activeTechnician.id);
    } catch {
      // ignore
    }
  }, [activeTechnician]);

  const selectedJobCard = useMemo(() => {
    if (!selectedJobId) return null;
    return jobCards.find(j => j.id === selectedJobId) || null;
  }, [jobCards, selectedJobId]);

  const openModal = (modalName: string, jobId?: string) => {
    if (jobId) {
      setSelectedJobId(jobId);
    }
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Job Card Management
  const createJobCard = (data: Omit<JobCard, 'id' | 'createdAt' | 'stageHistory' | 'injuries' | 'status' | 'metrics' | 'jobNo'> & { initialNotes?: string }): JobCard => {
    const nextSeq = jobCards.length + 848;
    const year = new Date().getFullYear();
    const jobNo = `JC-${year}-0${nextSeq}`;
    const id = `jc-${Date.now()}`;
    const nowISO = new Date().toISOString();

    const newJob: JobCard = {
      id,
      jobNo,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      fleetId: data.fleetId || '',
      vehicleNo: data.vehicleNo || '',
      tyreSerial: data.tyreSerial,
      brand: data.brand,
      size: data.size,
      casingType: data.casingType,
      casingCondition: data.casingCondition,
      processType: data.processType,
      treadPattern: data.treadPattern,
      priority: data.priority || 'NORMAL',
      currentStage: 'INITIAL_INSPECTION',
      status: 'IN_PROGRESS',
      estimatedPrice: data.estimatedPrice || (data.processType === 'DOUBLE_PROCESS' ? 8500 : data.processType === 'ONLY_RT' ? 6800 : 5900),
      createdAt: nowISO,
      targetDeliveryDate: data.targetDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      injuries: [],
      metrics: {
        initialTreadDepthMm: 2.0,
        originalBeltCondition: 'SOUND'
      },
      stageHistory: [
        {
          stage: 'INITIAL_INSPECTION',
          station: 'Intake Bay',
          technicianName: activeTechnician.name,
          timestamp: nowISO,
          notes: data.initialNotes || `Job Card created for ${data.processType} processing.`
        }
      ]
    };

    setJobCards(prev => [newJob, ...prev]);
    return newJob;
  };

  const updateJobCard = (id: string, updates: Partial<JobCard>) => {
    setJobCards(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, ...updates };
      }
      return job;
    }));
  };

  const advanceJobStage = (jobId: string, logNotes?: string, metricsUpdates?: Partial<JobCardMetrics>): boolean => {
    let success = false;

    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;

      const nextStage = getNextStage(job.processType, job.currentStage);
      if (!nextStage) return job;

      success = true;
      const nowISO = new Date().toISOString();
      const stationMeta = STAGE_META[job.currentStage];

      const newLog: StageLog = {
        stage: job.currentStage,
        station: stationMeta.stationName,
        technicianName: activeTechnician.name,
        timestamp: nowISO,
        notes: logNotes || `Station ${stationMeta.label} approved by ${activeTechnician.name}. Transferred to ${STAGE_META[nextStage].label}.`,
        metrics: metricsUpdates as Record<string, string | number | boolean>
      };

      const updatedMetrics: JobCardMetrics = {
        ...job.metrics,
        ...(metricsUpdates || {})
      };

      let newStatus = job.status;
      let completedAt = job.completedAt;

      if (nextStage === 'COMPLETED') {
        newStatus = 'READY_FOR_DELIVERY';
        completedAt = nowISO;
        if (!updatedMetrics.qcCertificateNo) {
          updatedMetrics.qcCertificateNo = `QC-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (!updatedMetrics.qcInspectorName) {
          updatedMetrics.qcInspectorName = activeTechnician.name;
        }
        if (!updatedMetrics.qcStatus) {
          updatedMetrics.qcStatus = 'PASSED';
        }
      }

      return {
        ...job,
        currentStage: nextStage,
        status: newStatus,
        completedAt,
        metrics: updatedMetrics,
        stageHistory: [...job.stageHistory, newLog]
      };
    }));

    return success;
  };

  const rejectJobCard = (jobId: string, reason: string, stage: ProcessStage) => {
    const nowISO = new Date().toISOString();
    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        currentStage: 'REJECTED',
        status: 'SCRAP',
        rejectReason: reason,
        rejectStage: stage,
        stageHistory: [
          ...job.stageHistory,
          {
            stage: 'REJECTED',
            station: STAGE_META[stage].stationName,
            technicianName: activeTechnician.name,
            timestamp: nowISO,
            notes: `SCRAPPED / REJECTED: ${reason}`
          }
        ]
      };
    }));
  };

  const markDelivered = (jobId: string) => {
    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        status: 'DELIVERED',
        stageHistory: [
          ...job.stageHistory,
          {
            stage: 'COMPLETED',
            station: 'Gate Dispatch',
            technicianName: activeTechnician.name,
            timestamp: new Date().toISOString(),
            notes: 'Gate pass generated. Tyre delivered to customer fleet.'
          }
        ]
      };
    }));
  };

  // Injury management
  const addInjury = (jobId: string, injury: Omit<TyreInjury, 'id'>) => {
    const newInjury: TyreInjury = {
      ...injury,
      id: `inj-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        injuries: [...job.injuries, newInjury]
      };
    }));
  };

  const updateInjury = (jobId: string, injuryId: string, updates: Partial<TyreInjury>) => {
    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        injuries: job.injuries.map(inj => inj.id === injuryId ? { ...inj, ...updates } : inj)
      };
    }));
  };

  const deleteInjury = (jobId: string, injuryId: string) => {
    setJobCards(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        injuries: job.injuries.filter(inj => inj.id !== injuryId)
      };
    }));
  };

  // Curing Batches
  const createCuringBatch = (batchData: Omit<CuringBatch, 'id' | 'batchNo'>): CuringBatch => {
    const nextSeq = curingBatches.length + 105;
    const batchNo = `${batchData.processType === 'ONLY_VC' ? 'VC' : batchData.processType === 'ONLY_RT' ? 'RT' : 'DP'}-BATCH-${nextSeq}`;
    const newBatch: CuringBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      batchNo,
      status: 'QUEUED',
      currentTempC: 25,
      currentPressureBar: 0,
      elapsedMinutes: 0
    };

    setCuringBatches(prev => [newBatch, ...prev]);
    return newBatch;
  };

  const addTyreToBatch = (batchId: string, jobId: string) => {
    setCuringBatches(prev => prev.map(b => {
      if (b.id === batchId && !b.tyreIds.includes(jobId) && b.tyreIds.length < b.capacity) {
        return { ...b, tyreIds: [...b.tyreIds, jobId] };
      }
      return b;
    }));

    // Update job metrics
    const batch = curingBatches.find(b => b.id === batchId);
    if (batch) {
      updateJobCard(jobId, {
        metrics: {
          ...selectedJobCard?.metrics,
          chamberId: batch.id,
          curingBatchNo: batch.batchNo
        }
      });
    }
  };

  const removeTyreFromBatch = (batchId: string, jobId: string) => {
    setCuringBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return { ...b, tyreIds: b.tyreIds.filter(id => id !== jobId) };
      }
      return b;
    }));
  };

  const startCuringBatch = (batchId: string) => {
    const nowISO = new Date().toISOString();
    setCuringBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          status: 'CURING',
          startedAt: nowISO,
          currentTempC: b.targetTempC,
          currentPressureBar: b.targetPressureBar,
          elapsedMinutes: 5
        };
      }
      return b;
    }));
  };

  const completeCuringBatch = (batchId: string) => {
    const nowISO = new Date().toISOString();
    const batch = curingBatches.find(b => b.id === batchId);
    if (!batch) return;

    setCuringBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          status: 'COMPLETED',
          completedAt: nowISO,
          elapsedMinutes: b.targetDurationMin
        };
      }
      return b;
    }));

    // Automatically advance all tyres in this batch from CURING to FINAL_QC
    if (batch.tyreIds.length > 0) {
      setJobCards(prev => prev.map(job => {
        if (batch.tyreIds.includes(job.id) && job.currentStage === 'CURING') {
          const nextStage = getNextStage(job.processType, 'CURING') || 'FINAL_QC';
          return {
            ...job,
            currentStage: nextStage,
            metrics: {
              ...job.metrics,
              cureEndTime: nowISO,
              cureDurationMinutes: batch.targetDurationMin,
              cureTempC: batch.targetTempC,
              curePressureBar: batch.targetPressureBar
            },
            stageHistory: [
              ...job.stageHistory,
              {
                stage: 'CURING',
                station: batch.chamberName,
                technicianName: batch.operatorName || activeTechnician.name,
                timestamp: nowISO,
                notes: `Curing completed in ${batch.batchNo} (${batch.targetDurationMin} min @ ${batch.targetTempC}°C, ${batch.targetPressureBar} bar). Passed to Final QC.`
              }
            ]
          };
        }
        return job;
      }));
    }
  };

  // Inventory Stock
  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: Math.max(0, newStock) } : item));
  };

  const restockItem = (id: string, qty: number, lotNo?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: item.stock + qty,
          lotNo: lotNo || item.lotNo
        };
      }
      return item;
    }));
  };

  const resetAllData = () => {
    setJobCards(INITIAL_JOB_CARDS);
    setCuringBatches(INITIAL_CURING_BATCHES);
    setInventory(INITIAL_INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
  };

  const exportDataJSON = () => {
    return JSON.stringify({
      jobCards,
      curingBatches,
      inventory,
      exportedAt: new Date().toISOString(),
      app: 'Tyre Retreading Unit ERP'
    }, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.jobCards)) {
        setJobCards(parsed.jobCards);
      }
      if (Array.isArray(parsed.curingBatches)) {
        setCuringBatches(parsed.curingBatches);
      }
      if (Array.isArray(parsed.inventory)) {
        setInventory(parsed.inventory);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <WorkshopContext.Provider
      value={{
        userRole,
        setUserRole,
        activeStation,
        setActiveStation,
        activeTechnician,
        setActiveTechnician,
        technicians,
        jobCards,
        curingBatches,
        inventory,
        selectedJobId,
        selectedJobCard,
        setSelectedJobId,
        processFilter,
        setProcessFilter,
        searchQuery,
        setSearchQuery,
        activeModal,
        openModal,
        closeModal,
        createJobCard,
        updateJobCard,
        advanceJobStage,
        rejectJobCard,
        markDelivered,
        addInjury,
        updateInjury,
        deleteInjury,
        createCuringBatch,
        addTyreToBatch,
        removeTyreFromBatch,
        startCuringBatch,
        completeCuringBatch,
        updateInventoryStock,
        restockItem,
        resetAllData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export const useWorkshop = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshop must be used within a WorkshopProvider');
  }
  return context;
};
