import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { JobCard, ProcessType } from '../../types';
import { ProcessBadge, StageBadge } from '../common/Badges';
import { STAGE_META, getStageProgressPercent } from '../../utils/processHelpers';
import { 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  ArrowUpDown,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

export const JobCardList: React.FC = () => {
  const { 
    jobCards, 
    processFilter, 
    setProcessFilter, 
    searchQuery, 
    setSearchQuery, 
    openModal, 
    markDelivered 
  } = useWorkshop();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'SCRAP'>('ALL');
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  const filteredJobs = jobCards.filter(job => {
    if (processFilter !== 'ALL' && job.processType !== processFilter) return false;
    if (statusFilter !== 'ALL' && job.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNo = job.jobNo.toLowerCase().includes(q);
      const matchSerial = job.tyreSerial.toLowerCase().includes(q);
      const matchCustomer = job.customerName.toLowerCase().includes(q);
      const matchBrand = job.brand.toLowerCase().includes(q);
      const matchSize = job.size.toLowerCase().includes(q);
      const matchFleet = (job.fleetId || '').toLowerCase().includes(q);
      if (!matchNo && !matchSerial && !matchCustomer && !matchBrand && !matchSize && !matchFleet) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Process Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Process:
          </span>
          <button
            onClick={() => setProcessFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition ${
              processFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({jobCards.length})
          </button>
          <button
            onClick={() => setProcessFilter('ONLY_VC')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition ${
              processFilter === 'ONLY_VC'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
            }`}
          >
            Only VC (Cold) ({jobCards.filter(j => j.processType === 'ONLY_VC').length})
          </button>
          <button
            onClick={() => setProcessFilter('ONLY_RT')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition ${
              processFilter === 'ONLY_RT'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
          >
            Only RT (Hot) ({jobCards.filter(j => j.processType === 'ONLY_RT').length})
          </button>
          <button
            onClick={() => setProcessFilter('DOUBLE_PROCESS')}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition ${
              processFilter === 'DOUBLE_PROCESS'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
            }`}
          >
            Double Process ({jobCards.filter(j => j.processType === 'DOUBLE_PROCESS').length})
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">WIP (In Progress)</option>
            <option value="READY_FOR_DELIVERY">Ready for Delivery</option>
            <option value="DELIVERED">Delivered / Invoiced</option>
            <option value="SCRAP">Scrapped / Rejected</option>
          </select>

          <button
            onClick={() => openModal('CREATE_JOB')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Job # & Serial</th>
                <th className="py-3 px-4">Customer / Fleet</th>
                <th className="py-3 px-4">Tyre Specification</th>
                <th className="py-3 px-4">Process Type</th>
                <th className="py-3 px-4">Current Stage & Progress</th>
                <th className="py-3 px-4">Delivery Due</th>
                <th className="py-3 px-4 text-right">Commercials</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No tyre job cards match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const progressPct = getStageProgressPercent(job.processType, job.currentStage);
                  const isScrapped = job.status === 'SCRAP';
                  const isReady = job.status === 'READY_FOR_DELIVERY';
                  const isDelivered = job.status === 'DELIVERED';

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      {/* Job No & Serial */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {job.jobNo}
                          {job.priority === 'URGENT' && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Urgent Priority" />
                          )}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">
                          S/N: {job.tyreSerial}
                        </div>
                      </td>

                      {/* Customer / Fleet */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {job.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {job.fleetId ? `Fleet: ${job.fleetId}` : job.vehicleNo ? `Veh: ${job.vehicleNo}` : job.customerPhone}
                        </div>
                      </td>

                      {/* Tyre Spec */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {job.brand}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {job.size} • <span className="text-slate-600 dark:text-slate-400">{job.casingType}</span>
                        </div>
                      </td>

                      {/* Process */}
                      <td className="py-3.5 px-4">
                        <ProcessBadge processType={job.processType} size="sm" />
                        <div className="text-[10px] text-slate-500 mt-1 max-w-[140px] truncate">
                          {job.treadPattern}
                        </div>
                      </td>

                      {/* Stage & Progress */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <div className="flex items-center gap-2 mb-1">
                          <StageBadge stage={job.currentStage} size="sm" />
                          <span className="text-[11px] font-mono text-slate-500">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isScrapped
                                ? 'bg-rose-500'
                                : isReady || isDelivered
                                ? 'bg-emerald-500'
                                : job.processType === 'DOUBLE_PROCESS'
                                ? 'bg-purple-600'
                                : job.processType === 'ONLY_RT'
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Delivery Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {job.targetDeliveryDate}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Created {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Commercials */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹{job.estimatedPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px]">
                          {isDelivered ? (
                            <span className="text-emerald-600 font-semibold">Delivered</span>
                          ) : isReady ? (
                            <span className="text-blue-600 font-semibold">Ready to Gate</span>
                          ) : isScrapped ? (
                            <span className="text-rose-600 font-semibold">Scrapped</span>
                          ) : (
                            <span className="text-amber-600 font-medium">In Process</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openModal('PRINT_JOB', job.id)}
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Print Job Card & Gate Pass"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {isReady && (
                            <button
                              onClick={() => markDelivered(job.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm flex items-center gap-1"
                              title="Release to Fleet & Gate Out"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Gate Out</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedJob(job)}
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Job Details Modal / Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {selectedJob.jobNo}
                  </h3>
                  <ProcessBadge processType={selectedJob.processType} size="sm" />
                  <StageBadge stage={selectedJob.currentStage} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedJob.brand} {selectedJob.size} • Tyre S/N: <strong className="text-blue-600 dark:text-blue-400 font-mono">{selectedJob.tyreSerial}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Customer / Fleet</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.customerName}</span>
                <div className="text-[10px] text-slate-500">{selectedJob.fleetId || selectedJob.customerPhone}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Tread Pattern</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.treadPattern}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Casing Condition</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedJob.casingCondition}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Estimated Price</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹{selectedJob.estimatedPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Technical Parameters Logged */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Logged Engineering Parameters:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">Buffed Circumference:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedJob.metrics.buffedCircumferenceMm || '--'} mm</span>
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">Cushion Gum Lot:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedJob.metrics.cushionGumBatch || '--'}</span>
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">Curing Batch / Chamber:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedJob.metrics.curingBatchNo || '--'}</span>
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">Cure Temp & Pressure:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedJob.metrics.cureTempC ? `${selectedJob.metrics.cureTempC}°C @ ${selectedJob.metrics.curePressureBar} bar` : '--'}</span>
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">Final Tread Depth:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedJob.metrics.finalTreadDepthMm ? `${selectedJob.metrics.finalTreadDepthMm} mm` : '--'}</span>
                </div>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/40">
                  <span className="text-slate-400 text-[10px] block">QC Certificate:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedJob.metrics.qcCertificateNo || 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Scrap Info if rejected */}
            {selectedJob.rejectReason && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs space-y-1 text-rose-800 dark:text-rose-300">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>SCRAP REJECTION RECORD</span>
                </div>
                <p>{selectedJob.rejectReason}</p>
                <div className="text-[10px] text-rose-600 dark:text-rose-400">
                  Rejected at stage: <strong>{selectedJob.rejectStage}</strong>
                </div>
              </div>
            )}

            {/* Stage Audit Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Audit Trail ({selectedJob.stageHistory.length} checkpoints):
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {selectedJob.stageHistory.map((h, i) => (
                  <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 text-xs flex justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <StageBadge stage={h.stage} size="sm" />
                        <span>{h.station}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{h.notes}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 shrink-0 font-mono text-right">
                      {h.technicianName}<br />
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  openModal('PRINT_JOB', selectedJob.id);
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate / Gate Pass</span>
              </button>

              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
