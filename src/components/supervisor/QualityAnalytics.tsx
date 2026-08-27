import React from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ProcessType } from '../../types';
import { ProcessBadge, StageBadge } from '../common/Badges';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  Disc, 
  Clock, 
  UserCheck 
} from 'lucide-react';

export const QualityAnalytics: React.FC = () => {
  const { jobCards, technicians } = useWorkshop();

  const totalJobs = jobCards.length;
  const completedJobs = jobCards.filter(j => j.status === 'READY_FOR_DELIVERY' || j.status === 'DELIVERED');
  const rejectedJobs = jobCards.filter(j => j.status === 'SCRAP');
  const wipJobs = jobCards.filter(j => j.status === 'IN_PROGRESS');

  const yieldRate = totalJobs > 0 ? (((totalJobs - rejectedJobs.length) / totalJobs) * 100).toFixed(1) : '100';
  const scrapRate = totalJobs > 0 ? ((rejectedJobs.length / totalJobs) * 100).toFixed(1) : '0';

  // Process breakdown
  const processStats: Record<ProcessType, { count: number; completed: number; scrap: number; revenue: number }> = {
    ONLY_VC: { count: 0, completed: 0, scrap: 0, revenue: 0 },
    ONLY_RT: { count: 0, completed: 0, scrap: 0, revenue: 0 },
    DOUBLE_PROCESS: { count: 0, completed: 0, scrap: 0, revenue: 0 }
  };

  jobCards.forEach(job => {
    processStats[job.processType].count += 1;
    if (job.status === 'READY_FOR_DELIVERY' || job.status === 'DELIVERED') {
      processStats[job.processType].completed += 1;
      processStats[job.processType].revenue += job.estimatedPrice;
    }
    if (job.status === 'SCRAP') {
      processStats[job.processType].scrap += 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overall Plant Retread Yield</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {yieldRate}%
            </span>
            <span className="text-xs text-slate-500">First-pass pass</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${yieldRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Casing Scrap & Reject Rate</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {scrapRate}%
            </span>
            <span className="text-xs text-slate-500">({rejectedJobs.length} casings scrapped)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${scrapRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Completed & Dispatched</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {completedJobs.length}
            </span>
            <span className="text-xs text-slate-500">Tyres certified</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {wipJobs.length} currently active on shop floor
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Retreading Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              ₹{(processStats.ONLY_VC.revenue + processStats.ONLY_RT.revenue + processStats.DOUBLE_PROCESS.revenue).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Based on invoiced & certified tyres
          </p>
        </div>
      </div>

      {/* Process-Wise Comparative Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Production Process Comparative Metrics
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ONLY VC CARD */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <ProcessBadge processType="ONLY_VC" size="md" />
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                {processStats.ONLY_VC.count} Total Jobs
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Completed / Dispatched:</span>
                <strong className="text-slate-900 dark:text-white">{processStats.ONLY_VC.completed} Tyres</strong>
              </div>
              <div className="flex justify-between">
                <span>Scrapped Rate:</span>
                <strong className="text-rose-600">
                  {processStats.ONLY_VC.count > 0 ? ((processStats.ONLY_VC.scrap / processStats.ONLY_VC.count) * 100).toFixed(0) : 0}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Total Invoiced:</span>
                <strong className="text-slate-900 dark:text-white font-mono">₹{processStats.ONLY_VC.revenue.toLocaleString()}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-blue-200 dark:border-blue-900 pt-2">
              Autoclave chamber cold precured process with standard turnaround of ~3.5 hours cure cycle.
            </p>
          </div>

          {/* ONLY RT CARD */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <ProcessBadge processType="ONLY_RT" size="md" />
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                {processStats.ONLY_RT.count} Total Jobs
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Completed / Dispatched:</span>
                <strong className="text-slate-900 dark:text-white">{processStats.ONLY_RT.completed} Tyres</strong>
              </div>
              <div className="flex justify-between">
                <span>Scrapped Rate:</span>
                <strong className="text-rose-600">
                  {processStats.ONLY_RT.count > 0 ? ((processStats.ONLY_RT.scrap / processStats.ONLY_RT.count) * 100).toFixed(0) : 0}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Total Invoiced:</span>
                <strong className="text-slate-900 dark:text-white font-mono">₹{processStats.ONLY_RT.revenue.toLocaleString()}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-amber-200 dark:border-amber-900 pt-2">
              High-temperature segmented matrix hot mold process for mining & heavy lug traction patterns.
            </p>
          </div>

          {/* DOUBLE PROCESS CARD */}
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <ProcessBadge processType="DOUBLE_PROCESS" size="md" />
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                {processStats.DOUBLE_PROCESS.count} Total Jobs
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Completed / Dispatched:</span>
                <strong className="text-slate-900 dark:text-white">{processStats.DOUBLE_PROCESS.completed} Tyres</strong>
              </div>
              <div className="flex justify-between">
                <span>Scrapped Rate:</span>
                <strong className="text-rose-600">
                  {processStats.DOUBLE_PROCESS.count > 0 ? ((processStats.DOUBLE_PROCESS.scrap / processStats.DOUBLE_PROCESS.count) * 100).toFixed(0) : 0}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Total Invoiced:</span>
                <strong className="text-slate-900 dark:text-white font-mono">₹{processStats.DOUBLE_PROCESS.revenue.toLocaleString()}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-purple-200 dark:border-purple-900 pt-2">
              Dual-stage workflow recovering high-value heavily damaged casings via Stage 1 RT spot cure + Stage 2 VC.
            </p>
          </div>
        </div>
      </div>

      {/* Scrap Root Cause Analysis Log */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Scrap & Quarantine Root Cause Analysis
        </h4>

        {rejectedJobs.length === 0 ? (
          <p className="text-xs text-slate-500">Zero scrapped casings recorded.</p>
        ) : (
          <div className="space-y-2">
            {rejectedJobs.map(job => (
              <div
                key={job.id}
                className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{job.jobNo}</span>
                    <span className="text-slate-600 dark:text-slate-400">({job.brand} {job.size})</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
                      Failed at: {job.rejectStage}
                    </span>
                  </div>
                  <p className="text-rose-700 dark:text-rose-300 font-medium mt-1">
                    Cause: {job.rejectReason}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Tyre S/N: {job.tyreSerial}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
