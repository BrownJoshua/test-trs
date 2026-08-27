import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { JobCardList } from './JobCardList';
import { ChamberBatchManager } from './ChamberBatchManager';
import { InventoryManager } from './InventoryManager';
import { QualityAnalytics } from './QualityAnalytics';
import { ProcessBadge } from '../common/Badges';
import { 
  Shield, 
  Layers, 
  Gauge, 
  Package, 
  BarChart3, 
  Plus, 
  Disc, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Clock, 
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { ProcessType, ProcessStage } from '../../types';

export const SupervisorDashboard: React.FC = () => {
  const { 
    jobCards, 
    curingBatches, 
    inventory, 
    openModal, 
    setProcessFilter 
  } = useWorkshop();

  const [activeTab, setActiveTab] = useState<'JOBS' | 'CHAMBER' | 'INVENTORY' | 'QUALITY'>('JOBS');

  // Compute metrics
  const activeWip = jobCards.filter(j => j.status === 'IN_PROGRESS');
  const readyDelivery = jobCards.filter(j => j.status === 'READY_FOR_DELIVERY');
  const scrapped = jobCards.filter(j => j.status === 'SCRAP');

  const onlyVcCount = jobCards.filter(j => j.processType === 'ONLY_VC' && j.status === 'IN_PROGRESS').length;
  const onlyRtCount = jobCards.filter(j => j.processType === 'ONLY_RT' && j.status === 'IN_PROGRESS').length;
  const doubleProcessCount = jobCards.filter(j => j.processType === 'DOUBLE_PROCESS' && j.status === 'IN_PROGRESS').length;

  const activeCuringBatches = curingBatches.filter(b => b.status === 'CURING');
  const lowStockCount = inventory.filter(i => i.stock <= i.minThreshold).length;

  // Stages count matrix for WIP
  const stages: { id: ProcessStage; label: string }[] = [
    { id: 'INITIAL_INSPECTION', label: '1. Inspection' },
    { id: 'BUFFING', label: '2. Buffing' },
    { id: 'SKIVING_REPAIR', label: '3. Skiving' },
    { id: 'SECTION_CURE', label: '4. Section RT' },
    { id: 'BUILDING', label: '5. Building' },
    { id: 'CURING', label: '6. Curing' },
    { id: 'FINAL_QC', label: '7. Final QC' }
  ];

  const getStageCountByProcess = (stage: ProcessStage, process: ProcessType) => {
    return jobCards.filter(j => j.currentStage === stage && j.processType === process && j.status === 'IN_PROGRESS').length;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with High-Level Plant KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Active WIP */}
        <div 
          onClick={() => { setActiveTab('JOBS'); setProcessFilter('ALL'); }}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total WIP</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {activeWip.length}
            </span>
            <span className="text-[11px] text-slate-500">Tyres active</span>
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">
            Shop floor live queue
          </div>
        </div>

        {/* Only VC */}
        <div 
          onClick={() => { setActiveTab('JOBS'); setProcessFilter('ONLY_VC'); }}
          className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 shadow-sm cursor-pointer hover:border-blue-400 transition"
        >
          <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 text-xs font-semibold">
            <span>Only VC (Cold)</span>
            <Disc className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-blue-700 dark:text-blue-300">
              {onlyVcCount}
            </span>
            <span className="text-[11px] text-blue-600/70">Precured</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Envelope & Autoclave
          </div>
        </div>

        {/* Only RT */}
        <div 
          onClick={() => { setActiveTab('JOBS'); setProcessFilter('ONLY_RT'); }}
          className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 shadow-sm cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <span>Only RT (Hot)</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300">
              {onlyRtCount}
            </span>
            <span className="text-[11px] text-amber-600/70">Matrix Mold</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Hot Camelback Press
          </div>
        </div>

        {/* Double Process */}
        <div 
          onClick={() => { setActiveTab('JOBS'); setProcessFilter('DOUBLE_PROCESS'); }}
          className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 shadow-sm cursor-pointer hover:border-purple-400 transition"
        >
          <div className="flex items-center justify-between text-purple-800 dark:text-purple-300 text-xs font-semibold">
            <span>Double Process</span>
            <Gauge className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-purple-700 dark:text-purple-300">
              {doubleProcessCount}
            </span>
            <span className="text-[11px] text-purple-600/70">RT + VC</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Section Spot + Chamber
          </div>
        </div>

        {/* Ready for Delivery */}
        <div 
          onClick={() => setActiveTab('JOBS')}
          className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 shadow-sm cursor-pointer hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span>Ready Dispatch</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
              {readyDelivery.length}
            </span>
            <span className="text-[11px] text-emerald-600/70">Gate Out</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            QC Certificate Tagged
          </div>
        </div>

        {/* Scrap / Alert */}
        <div 
          onClick={() => setActiveTab('QUALITY')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-rose-400 transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Scrap / Quarantine</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {scrapped.length}
            </span>
            <span className="text-[11px] text-slate-500">Casings</span>
          </div>
          <div className="text-[10px] text-rose-600 font-medium mt-1">
            Failed RMA criteria
          </div>
        </div>
      </div>

      {/* Interactive Shop Floor Process Pipeline Flow Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Live WIP Distribution Across Workstation Bays
            </h3>
            <p className="text-xs text-slate-500">
              Real-time bottleneck analysis across Only VC, Only RT, and Double Process production lines.
            </p>
          </div>
          <button
            onClick={() => openModal('CREATE_JOB')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Job Intake</span>
          </button>
        </div>

        {/* Pipeline Stage Funnel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stg) => {
            const vc = getStageCountByProcess(stg.id, 'ONLY_VC');
            const rt = getStageCountByProcess(stg.id, 'ONLY_RT');
            const dp = getStageCountByProcess(stg.id, 'DOUBLE_PROCESS');
            const totalStage = vc + rt + dp;

            return (
              <div
                key={stg.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {stg.label}
                  </span>
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                    totalStage > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {totalStage}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between items-center text-blue-700 dark:text-blue-300">
                    <span>VC:</span>
                    <span className="font-mono font-bold">{vc}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-700 dark:text-amber-300">
                    <span>RT:</span>
                    <span className="font-mono font-bold">{rt}</span>
                  </div>
                  <div className="flex justify-between items-center text-purple-700 dark:text-purple-300">
                    <span>DP:</span>
                    <span className="font-mono font-bold">{dp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Tabs for Plant Management */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('JOBS')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'JOBS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Tyre Job Cards & WIP ({jobCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAMBER')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'CHAMBER'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Curing Chambers & Autoclaves ({curingBatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'INVENTORY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Raw Materials & Inventory ({inventory.length})</span>
            {lowStockCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('QUALITY')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'QUALITY'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Quality & Scrap Analytics</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'JOBS' && <JobCardList />}
        {activeTab === 'CHAMBER' && <ChamberBatchManager />}
        {activeTab === 'INVENTORY' && <InventoryManager />}
        {activeTab === 'QUALITY' && <QualityAnalytics />}
      </div>
    </div>
  );
};
