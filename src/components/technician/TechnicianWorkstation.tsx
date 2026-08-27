import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { JobCard, ProcessStage, JobCardMetrics } from '../../types';
import { ProcessBadge, StageBadge } from '../common/Badges';
import { PROCESS_CONFIG, STAGE_META, getNextStage } from '../../utils/processHelpers';
import { TyreDamageMapper } from './TyreDamageMapper';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  User, 
  Sparkles, 
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Disc,
  Layers,
  Wrench,
  Flame,
  ShieldCheck,
  Search,
  Gauge
} from 'lucide-react';

export const TechnicianWorkstation: React.FC = () => {
  const { 
    jobCards, 
    activeStation, 
    activeTechnician, 
    advanceJobStage, 
    rejectJobCard, 
    addInjury, 
    updateInjury, 
    deleteInjury,
    searchQuery,
    processFilter,
    setProcessFilter,
    openModal
  } = useWorkshop();

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [scrapModalJob, setScrapModalJob] = useState<JobCard | null>(null);
  const [scrapReason, setScrapReason] = useState<string>('');

  // Station Form States per active card
  const [stageMetrics, setStageMetrics] = useState<Record<string, Partial<JobCardMetrics>>>({});
  const [stageNotes, setStageNotes] = useState<Record<string, string>>({});

  // Map station to process stages
  const getStationStages = (station: string): ProcessStage[] => {
    switch (station) {
      case 'INSPECTION': return ['INITIAL_INSPECTION'];
      case 'BUFFING': return ['BUFFING'];
      case 'SKIVING_REPAIR': return ['SKIVING_REPAIR'];
      case 'BUILDING': return ['BUILDING'];
      case 'CURING': return ['SECTION_CURE', 'CURING'];
      case 'FINAL_QC': return ['FINAL_QC'];
      default: return ['INITIAL_INSPECTION', 'BUFFING', 'SKIVING_REPAIR', 'SECTION_CURE', 'BUILDING', 'CURING', 'FINAL_QC'];
    }
  };

  const allowedStages = getStationStages(activeStation);

  // Filter jobs
  const stationJobs = jobCards.filter(job => {
    // Must match stage
    if (!allowedStages.includes(job.currentStage)) return false;
    // Must match process filter if not ALL
    if (processFilter !== 'ALL' && job.processType !== processFilter) return false;
    // Must match search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNo = job.jobNo.toLowerCase().includes(q);
      const matchSerial = job.tyreSerial.toLowerCase().includes(q);
      const matchCustomer = job.customerName.toLowerCase().includes(q);
      const matchBrand = job.brand.toLowerCase().includes(q);
      const matchSize = job.size.toLowerCase().includes(q);
      if (!matchNo && !matchSerial && !matchCustomer && !matchBrand && !matchSize) return false;
    }
    return true;
  });

  const getMetricsForJob = (job: JobCard): Partial<JobCardMetrics> => {
    return stageMetrics[job.id] || { ...job.metrics };
  };

  const handleMetricChange = (jobId: string, key: keyof JobCardMetrics, val: unknown) => {
    setStageMetrics(prev => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || {}),
        [key]: val
      }
    }));
  };

  const handleAdvance = (job: JobCard) => {
    const metrics = getMetricsForJob(job);
    const notes = stageNotes[job.id] || '';
    const next = getNextStage(job.processType, job.currentStage);

    const ok = advanceJobStage(job.id, notes, metrics);
    if (ok) {
      if (next === 'COMPLETED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      // Reset form states
      setStageNotes(prev => {
        const copy = { ...prev };
        delete copy[job.id];
        return copy;
      });
      setStageMetrics(prev => {
        const copy = { ...prev };
        delete copy[job.id];
        return copy;
      });
    }
  };

  const handleScrapConfirm = () => {
    if (!scrapModalJob || !scrapReason.trim()) return;
    rejectJobCard(scrapModalJob.id, scrapReason, scrapModalJob.currentStage);
    setScrapModalJob(null);
    setScrapReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Operator Queue Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SHOP FLOOR WORKSTATION
            </span>
            <span className="text-xs text-slate-400">
              Active Station: <strong className="text-white">{activeStation === 'ALL' ? 'All Workshop Bays' : activeStation}</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Operator Queue: <span className="text-blue-400">{stationJobs.length} Tyres Pending Action</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Logged-in Operator: <strong className="text-slate-200">{activeTechnician.name}</strong> ({activeTechnician.code}) • Shift: <span className="text-amber-300">{activeTechnician.shift}</span> • Ensure all stage measurement tolerances & inspection standards are recorded.
          </p>
        </div>

        {/* Quick Process Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setProcessFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              processFilter === 'ALL'
                ? 'bg-blue-600 border-blue-500 text-white shadow'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Processes ({jobCards.filter(j => j.status === 'IN_PROGRESS').length})
          </button>
          <button
            onClick={() => setProcessFilter('ONLY_VC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              processFilter === 'ONLY_VC'
                ? 'bg-blue-600 border-blue-500 text-white shadow'
                : 'bg-slate-800 border-slate-700 text-blue-300 hover:bg-slate-700'
            }`}
          >
            Only VC (Cold)
          </button>
          <button
            onClick={() => setProcessFilter('ONLY_RT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              processFilter === 'ONLY_RT'
                ? 'bg-amber-600 border-amber-500 text-white shadow'
                : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
            }`}
          >
            Only RT (Hot)
          </button>
          <button
            onClick={() => setProcessFilter('DOUBLE_PROCESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              processFilter === 'DOUBLE_PROCESS'
                ? 'bg-purple-600 border-purple-500 text-white shadow'
                : 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700'
            }`}
          >
            Double Process (RT+VC)
          </button>
        </div>
      </div>

      {/* Queue Card List */}
      {stationJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Station Queue is Clear!
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No tyres are currently queued at this workstation for the selected filter. Switch bay filter or check supervisor pipeline for newly arrived job cards.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stationJobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const processConfig = PROCESS_CONFIG[job.processType];
            const stageMeta = STAGE_META[job.currentStage];
            const nextStage = getNextStage(job.processType, job.currentStage);
            const currentMetrics = getMetricsForJob(job);

            return (
              <div
                key={job.id}
                id={`tech-job-card-${job.id}`}
                className={`bg-white dark:bg-slate-900 rounded-xl border transition shadow-sm overflow-hidden ${
                  isExpanded 
                    ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Job Card Header */}
                <div 
                  onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-950 text-white flex flex-col items-center justify-center font-mono font-bold text-xs shadow">
                      <Disc className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                          {job.jobNo}
                        </span>
                        <ProcessBadge processType={job.processType} size="sm" />
                        <StageBadge stage={job.currentStage} size="sm" />
                        {job.priority === 'URGENT' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse border border-rose-200">
                            URGENT RUSH
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        <strong className="text-slate-800 dark:text-slate-200">{job.brand} {job.size}</strong> • Tyre S/N: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{job.tyreSerial}</span> • Customer: <span className="font-medium text-slate-700 dark:text-slate-300">{job.customerName}</span> ({job.fleetId || 'Private Fleet'})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-slate-400">Target Delivery:</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {job.targetDeliveryDate}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Station Workspace Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
                    {/* Process Guidance Banner */}
                    <div className={`p-3.5 rounded-lg border text-xs ${processConfig.accentBg} ${processConfig.accentBorder} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Process Workflow: {processConfig.label}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {processConfig.description} • Curing: <strong>{processConfig.cureMethod}</strong> ({processConfig.tempRange})
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('PRINT_JOB', job.id);
                        }}
                        className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold flex items-center gap-1 shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Job Card & QR</span>
                      </button>
                    </div>

                    {/* Stage Form Specific Inputs */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            {stageMeta.order}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {stageMeta.label}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {stageMeta.desc}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">
                          Station: {stageMeta.stationName}
                        </span>
                      </div>

                      {/* 1. INITIAL INSPECTION CONTROLS */}
                      {job.currentStage === 'INITIAL_INSPECTION' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Initial Tread Depth (mm)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentMetrics.initialTreadDepthMm ?? 2.0}
                                onChange={(e) => handleMetricChange(job.id, 'initialTreadDepthMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Casing Condition Grade
                              </label>
                              <select
                                value={job.casingCondition}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                disabled
                              >
                                <option>{job.casingCondition}</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Steel Belt Package Integrity
                              </label>
                              <select
                                value={currentMetrics.originalBeltCondition || 'SOUND'}
                                onChange={(e) => handleMetricChange(job.id, 'originalBeltCondition', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              >
                                <option value="SOUND">SOUND - No Belt Oxidation / Separation</option>
                                <option value="EXPOSED">EXPOSED - Minor Wire Exposed (Requires Spot Grind)</option>
                                <option value="RUSTED">RUSTED - Moderate Oxidation (Inspect Skive)</option>
                              </select>
                            </div>
                          </div>

                          {/* Embedded Tyre Damage Mapper */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <TyreDamageMapper
                              injuries={job.injuries}
                              onAddInjury={(inj) => addInjury(job.id, inj)}
                              onUpdateInjury={(injId, upd) => updateInjury(job.id, injId, upd)}
                              onDeleteInjury={(injId) => deleteInjury(job.id, injId)}
                            />
                          </div>
                        </div>
                      )}

                      {/* 2. BUFFING CONTROLS */}
                      {job.currentStage === 'BUFFING' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Target Circumference (mm)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.targetCircumferenceMm ?? (job.size.includes('295') ? 3180 : 3340)}
                                onChange={(e) => handleMetricChange(job.id, 'targetCircumferenceMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Buffed Circumference (mm)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.buffedCircumferenceMm ?? (job.size.includes('295') ? 3182 : 3342)}
                                onChange={(e) => handleMetricChange(job.id, 'buffedCircumferenceMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Undertread Thickness (mm)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentMetrics.undertreadThicknessMm ?? 2.5}
                                onChange={(e) => handleMetricChange(job.id, 'undertreadThicknessMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Buffing Texture (RMA Spec)
                              </label>
                              <select
                                value={currentMetrics.buffTextureRMA || 'RMA 3'}
                                onChange={(e) => handleMetricChange(job.id, 'buffTextureRMA', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              >
                                <option value="RMA 3">RMA 3 (Velvet Texture - Precured VC)</option>
                                <option value="RMA 4">RMA 4 (Medium Rough - Matrix RT)</option>
                                <option value="RMA 5">RMA 5 (Heavy Coarse)</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <Disc className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>
                              Circumference tolerance: <strong>±3 mm</strong>. Ensure crown radius matches matrix template #{job.size.includes('295') ? 'R16' : 'R18'}.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 3. SKIVING & REPAIR CONTROLS */}
                      {job.currentStage === 'SKIVING_REPAIR' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Cement Batch Lot #
                              </label>
                              <input
                                type="text"
                                value={currentMetrics.cementsBatchNo || 'CEM-2026-L8'}
                                onChange={(e) => handleMetricChange(job.id, 'cementsBatchNo', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Vulcanizing Solution
                              </label>
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="checkbox"
                                  id={`cement-check-${job.id}`}
                                  checked={currentMetrics.vulcanizingSolutionApplied ?? true}
                                  onChange={(e) => handleMetricChange(job.id, 'vulcanizingSolutionApplied', e.target.checked)}
                                  className="w-4 h-4 rounded text-blue-600"
                                />
                                <label htmlFor={`cement-check-${job.id}`} className="text-xs text-slate-700 dark:text-slate-300">
                                  Cement Sprayed & Flash-Dried (15 min)
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Total Injuries Skived & Cleaned
                              </label>
                              <div className="text-xs font-bold px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                {job.injuries.length} logged injury points
                              </div>
                            </div>
                          </div>

                          {/* Embedded Damage Mapper for repair check */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <TyreDamageMapper
                              injuries={job.injuries}
                              onAddInjury={(inj) => addInjury(job.id, inj)}
                              onUpdateInjury={(injId, upd) => updateInjury(job.id, injId, upd)}
                              onDeleteInjury={(injId) => deleteInjury(job.id, injId)}
                            />
                          </div>
                        </div>
                      )}

                      {/* 4. DOUBLE PROCESS STAGE 1 SECTION CURE */}
                      {job.currentStage === 'SECTION_CURE' && (
                        <div className="space-y-3">
                          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              <strong>Double Process Phase 1 Active:</strong> Pre-curing deep structural section patch on heated spot vulcanizer prior to tread building.
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Spot Vulcanizer Machine #
                              </label>
                              <input
                                type="text"
                                value={currentMetrics.sectionCureMachine || 'Spot Press SV-02'}
                                onChange={(e) => handleMetricChange(job.id, 'sectionCureMachine', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Spot Cure Temp (°C)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.sectionCureTempC ?? 150}
                                onChange={(e) => handleMetricChange(job.id, 'sectionCureTempC', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Dwell Time (Minutes)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.sectionCureDurationMin ?? 45}
                                onChange={(e) => handleMetricChange(job.id, 'sectionCureDurationMin', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. TREAD BUILDING CONTROLS */}
                      {job.currentStage === 'BUILDING' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Cushion Gum Lot #
                              </label>
                              <input
                                type="text"
                                value={currentMetrics.cushionGumBatch || 'CG-880-AUG26'}
                                onChange={(e) => handleMetricChange(job.id, 'cushionGumBatch', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Gum Thickness (mm)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentMetrics.cushionGumThicknessMm ?? 1.2}
                                onChange={(e) => handleMetricChange(job.id, 'cushionGumThicknessMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Tread Roll Lot / Compound
                              </label>
                              <input
                                type="text"
                                value={currentMetrics.treadRollLotNo || 'TR-PC-RIB-802'}
                                onChange={(e) => handleMetricChange(job.id, 'treadRollLotNo', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Splice Stitching Quality
                              </label>
                              <select
                                value={currentMetrics.spliceQuality || 'EXCELLENT'}
                                onChange={(e) => handleMetricChange(job.id, 'spliceQuality', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              >
                                <option value="EXCELLENT">EXCELLENT (Zero overlap gap)</option>
                                <option value="GOOD">GOOD (Stitched to spec)</option>
                                <option value="RE-STITCHED">RE-STITCHED</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                            <span>Selected Tread Pattern: <strong>{job.treadPattern}</strong></span>
                            <span>Cut Length Target: <strong>3,176 mm</strong></span>
                          </div>
                        </div>
                      )}

                      {/* 6. CURING CHAMBER / MOLD CONTROLS */}
                      {job.currentStage === 'CURING' && (
                        <div className="space-y-3">
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-900 text-xs text-purple-800 dark:text-purple-300 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gauge className="w-4 h-4 text-purple-600 shrink-0" />
                              <span>
                                {job.processType === 'ONLY_RT'
                                  ? 'Hot Matrix Mold Press Vulcanization (145-155°C @ 14 bar)'
                                  : 'Autoclave Vacuum Chamber Vulcanization (105°C @ 6.2 bar)'}
                              </span>
                            </div>
                            <span className="font-mono font-bold">
                              Batch: {job.metrics.curingBatchNo || 'VC-BATCH-104'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Outer Envelope #
                              </label>
                              <input
                                type="text"
                                value={currentMetrics.envelopeSerialNo || 'ENV-225-88'}
                                onChange={(e) => handleMetricChange(job.id, 'envelopeSerialNo', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Chamber Temperature (°C)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.cureTempC ?? (job.processType === 'ONLY_RT' ? 152 : 105)}
                                onChange={(e) => handleMetricChange(job.id, 'cureTempC', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Chamber Pressure (bar)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentMetrics.curePressureBar ?? (job.processType === 'ONLY_RT' ? 14.5 : 6.2)}
                                onChange={(e) => handleMetricChange(job.id, 'curePressureBar', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Cure Duration (Min)
                              </label>
                              <input
                                type="number"
                                value={currentMetrics.cureDurationMinutes ?? (job.processType === 'ONLY_RT' ? 90 : 210)}
                                onChange={(e) => handleMetricChange(job.id, 'cureDurationMinutes', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 7. FINAL QC & RELEASE CONTROLS */}
                      {job.currentStage === 'FINAL_QC' && (
                        <div className="space-y-4">
                          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded border border-teal-200 dark:border-teal-900 text-xs text-teal-800 dark:text-teal-300 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                              <span>
                                <strong>Final Quality Audit & Dispatch Sign-Off:</strong> Perform tactile shearography, bead seat audit & dynamic wheel balancing.
                              </span>
                            </div>
                            <span className="font-mono font-bold">
                              Cert #{currentMetrics.qcCertificateNo || 'QC-CERT-2026-0419'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Final Tread Depth (mm)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentMetrics.finalTreadDepthMm ?? 15.0}
                                onChange={(e) => handleMetricChange(job.id, 'finalTreadDepthMm', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Final Weight (kg)
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={currentMetrics.finalWeightKg ?? 50.5}
                                onChange={(e) => handleMetricChange(job.id, 'finalWeightKg', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Dynamic Balance Status
                              </label>
                              <select
                                value={currentMetrics.balanceChecked ? 'PASSED' : 'PENDING'}
                                onChange={(e) => handleMetricChange(job.id, 'balanceChecked', e.target.value === 'PASSED')}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                              >
                                <option value="PASSED">PASSED (Within 40g)</option>
                                <option value="PENDING">PENDING CHECK</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                QC Result
                              </label>
                              <select
                                value={currentMetrics.qcStatus || 'PASSED'}
                                onChange={(e) => handleMetricChange(job.id, 'qcStatus', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-emerald-600"
                              >
                                <option value="PASSED">PASSED - Release to Dispatch</option>
                                <option value="REWORK_NEEDED">REWORK NEEDED</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Technician Stage Notes Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Technician Log Remarks & Station Sign-Off:
                        </label>
                        <input
                          type="text"
                          value={stageNotes[job.id] || ''}
                          onChange={(e) => setStageNotes(prev => ({ ...prev, [job.id]: e.target.value }))}
                          placeholder={`Add station notes (e.g. ${stageMeta.short} verified by ${activeTechnician.name})...`}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Stage History Timeline */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Stage Audit Trail ({job.stageHistory.length} checkpoints recorded)
                      </h5>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {job.stageHistory.map((log, idx) => (
                          <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <StageBadge stage={log.stage} size="sm" />
                              <span className="text-slate-600 dark:text-slate-300">{log.notes}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 shrink-0 font-mono">
                              👤 {log.technicianName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setScrapModalJob(job)}
                        className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Flag Defect & Scrap Casing</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {nextStage ? (
                          <button
                            type="button"
                            onClick={() => handleAdvance(job)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition active:scale-95"
                          >
                            <span>Approve & Transfer to: {STAGE_META[nextStage].short}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-4 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-not-allowed"
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>Job Completed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SCRAP / REJECT MODAL */}
      {scrapModalJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reject & Scrap Tyre Casing
                </h3>
                <p className="text-xs text-slate-500">
                  Job: <strong className="font-mono text-slate-700 dark:text-slate-300">{scrapModalJob.jobNo}</strong> ({scrapModalJob.brand} {scrapModalJob.size})
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Common Failure Root Causes:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    'Radial ply wire cut / rusted cord package',
                    'Crown belt package delamination / separation',
                    'Innerliner porosity / heavy ozone cracking',
                    'Bead ring deformed / fractured bead bundle',
                    'Out-of-round casing / excessive buffing runout',
                    'Shoulder separation exceeding RMA limits'
                  ].map((cause) => (
                    <button
                      key={cause}
                      type="button"
                      onClick={() => setScrapReason(cause)}
                      className="p-2 rounded text-left border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition text-[11px]"
                    >
                      • {cause}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Technical Scrap Justification:
                </label>
                <textarea
                  rows={3}
                  value={scrapReason}
                  onChange={(e) => setScrapReason(e.target.value)}
                  placeholder="Detail the failure condition per ISO/RMA retreading standards..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setScrapModalJob(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScrapConfirm}
                disabled={!scrapReason.trim()}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
              >
                Confirm Scrap Quarantine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
