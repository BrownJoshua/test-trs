import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { CuringBatch, ProcessType } from '../../types';
import { ProcessBadge } from '../common/Badges';
import { 
  Gauge, 
  Flame, 
  Play, 
  CheckCircle2, 
  Plus, 
  Disc, 
  Thermometer, 
  Clock, 
  User, 
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ChamberBatchManager: React.FC = () => {
  const { 
    curingBatches, 
    jobCards, 
    createCuringBatch, 
    addTyreToBatch, 
    removeTyreFromBatch, 
    startCuringBatch, 
    completeCuringBatch,
    activeTechnician
  } = useWorkshop();

  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [newChamberName, setNewChamberName] = useState('Autoclave Chamber VC-02 (Capacity: 16)');
  const [newChamberType, setNewChamberType] = useState<'AUTOCLAVE_VC' | 'HOT_MOLD_RT'>('AUTOCLAVE_VC');
  const [newProcessType, setNewProcessType] = useState<ProcessType>('ONLY_VC');
  const [newCapacity, setNewCapacity] = useState(16);
  const [newTemp, setNewTemp] = useState(105);
  const [newPressure, setNewPressure] = useState(6.2);
  const [newDuration, setNewDuration] = useState(210);

  // Tyres currently in CURING stage
  const tyresInCuringStage = jobCards.filter(j => j.currentStage === 'CURING');

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    createCuringBatch({
      chamberName: newChamberName,
      chamberType: newChamberType,
      processType: newProcessType,
      capacity: newCapacity,
      tyreIds: [],
      status: 'QUEUED',
      targetTempC: newTemp,
      targetPressureBar: newPressure,
      targetDurationMin: newDuration,
      operatorName: activeTechnician.name
    });
    setShowNewBatchModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Curing Chambers & Autoclave Batch Scheduler
          </h3>
          <p className="text-xs text-slate-500">
            Monitor and control Vacuum Curing (VC) Autoclaves & Hot Mold (RT) matrix presses in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowNewBatchModal(true)}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Chamber Batch</span>
        </button>
      </div>

      {/* Unassigned Tyres Queue awaiting Chamber Loading */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-blue-600" />
            Tyres in Curing Stage Waiting for Chamber Assignment ({tyresInCuringStage.length} Tyres)
          </span>
          <span className="text-[11px] text-slate-500">
            Click 'Load into Batch' below to assign tyre to an active chamber run.
          </span>
        </div>

        {tyresInCuringStage.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">
            No tyres are currently in the Curing queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {tyresInCuringStage.map(job => {
              const loadedBatch = curingBatches.find(b => b.tyreIds.includes(job.id));

              return (
                <div
                  key={job.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {job.jobNo}
                    </span>
                    <ProcessBadge processType={job.processType} size="sm" />
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <strong>{job.brand} {job.size}</strong> • S/N: <span className="font-mono">{job.tyreSerial}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                    <span>Envelope: <strong className="text-slate-700 dark:text-slate-300">{job.metrics.envelopeSerialNo || 'ENV-225-88'}</strong></span>
                    {loadedBatch ? (
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        Loaded in {loadedBatch.batchNo}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Chamber Batch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {curingBatches.map(batch => {
          const isCuring = batch.status === 'CURING';
          const isCompleted = batch.status === 'COMPLETED';
          const isQueued = batch.status === 'QUEUED';
          const progressPct = batch.targetDurationMin > 0 ? Math.min(100, Math.round(((batch.elapsedMinutes || 0) / batch.targetDurationMin) * 100)) : 0;
          const loadedJobs = jobCards.filter(j => batch.tyreIds.includes(j.id));
          const eligibleUnloadedJobs = tyresInCuringStage.filter(j => !batch.tyreIds.includes(j.id) && (batch.processType === 'DOUBLE_PROCESS' ? true : j.processType === batch.processType));

          return (
            <div
              key={batch.id}
              className={`rounded-xl border transition shadow-sm overflow-hidden flex flex-col justify-between ${
                isCuring
                  ? 'border-purple-500 dark:border-purple-500 bg-purple-950/10 dark:bg-purple-950/20 ring-1 ring-purple-500/30'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Batch Top Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {batch.batchNo}
                  </span>
                  <ProcessBadge processType={batch.processType} size="sm" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {batch.chamberName}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Capacity: <strong>{batch.tyreIds.length} / {batch.capacity} Tyres</strong></span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    isCuring ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 animate-pulse' :
                    isCompleted ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    ● {batch.status}
                  </span>
                </div>
              </div>

              {/* Telemetry Dials & Live Cycle Stats */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-500" /> Chamber Temp
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                      {isCuring ? `${batch.currentTempC}°C` : `${batch.targetTempC}°C`}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Target: {batch.targetTempC}°C</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block flex items-center justify-center gap-1">
                      <Gauge className="w-3 h-3 text-blue-500" /> Chamber Pressure
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                      {isCuring ? `${batch.currentPressureBar} bar` : `${batch.targetPressureBar} bar`}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Target: {batch.targetPressureBar} bar</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Cycle Elapsed: {batch.elapsedMinutes || 0} / {batch.targetDurationMin} mins</span>
                    <span className="font-bold">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCuring ? 'bg-purple-600' : isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Loaded Tyres in this Batch */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Loaded Tyres ({loadedJobs.length}):</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {loadedJobs.length === 0 ? (
                      <div className="p-2 text-center text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded border border-dashed border-slate-200 dark:border-slate-700">
                        No tyres loaded yet.
                      </div>
                    ) : (
                      loadedJobs.map(j => (
                        <div
                          key={j.id}
                          className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                        >
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{j.jobNo}</span>
                          <span className="text-slate-500 text-[11px]">{j.brand} ({j.size})</span>
                          {isQueued && (
                            <button
                              onClick={() => removeTyreFromBatch(batch.id, j.id)}
                              className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Tyre Loader Selector when Queued */}
                {isQueued && eligibleUnloadedJobs.length > 0 && batch.tyreIds.length < batch.capacity && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      + Add Waiting Tyre to Batch:
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addTyreToBatch(batch.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <option value="" disabled>Select tyre to load...</option>
                      {eligibleUnloadedJobs.map(j => (
                        <option key={j.id} value={j.id}>
                          {j.jobNo} - {j.brand} {j.size} (S/N: {j.tyreSerial})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Bottom Chamber Controls */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
                {isQueued && (
                  <button
                    type="button"
                    onClick={() => startCuringBatch(batch.id)}
                    disabled={batch.tyreIds.length === 0}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Curing Cycle ({batch.tyreIds.length} Tyres)</span>
                  </button>
                )}

                {isCuring && (
                  <button
                    type="button"
                    onClick={() => completeCuringBatch(batch.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Cycle & Transfer to Final QC</span>
                  </button>
                )}

                {isCompleted && (
                  <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1 py-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cycle Finished • Tyres Transferred to QC</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE BATCH MODAL */}
      {showNewBatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Curing Run Batch
            </h3>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Chamber Name</label>
                <input
                  type="text"
                  value={newChamberName}
                  onChange={(e) => setNewChamberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Process Type</label>
                  <select
                    value={newProcessType}
                    onChange={(e) => {
                      const pt = e.target.value as ProcessType;
                      setNewProcessType(pt);
                      if (pt === 'ONLY_RT') {
                        setNewChamberType('HOT_MOLD_RT');
                        setNewTemp(152);
                        setNewPressure(14.5);
                        setNewDuration(90);
                        setNewCapacity(2);
                      } else {
                        setNewChamberType('AUTOCLAVE_VC');
                        setNewTemp(105);
                        setNewPressure(6.2);
                        setNewDuration(210);
                        setNewCapacity(16);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ONLY_VC">Only VC (Cold Autoclave)</option>
                    <option value="ONLY_RT">Only RT (Hot Mold Matrix)</option>
                    <option value="DOUBLE_PROCESS">Double Process (Stage 2 VC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Chamber Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Temp (°C)</label>
                  <input
                    type="number"
                    value={newTemp}
                    onChange={(e) => setNewTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPressure}
                    onChange={(e) => setNewPressure(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
