import React from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ProcessBadge, StageBadge } from '../common/Badges';
import { PROCESS_CONFIG, STAGE_META } from '../../utils/processHelpers';
import { 
  Printer, 
  X, 
  Disc, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Calendar, 
  Truck, 
  FileText 
} from 'lucide-react';

export const JobCardPrintModal: React.FC = () => {
  const { activeModal, closeModal, selectedJobCard } = useWorkshop();

  if (activeModal !== 'PRINT_JOB' || !selectedJobCard) return null;

  const job = selectedJobCard;
  const processConfig = PROCESS_CONFIG[job.processType];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto print:border-none print:shadow-none print:max-w-full print:m-0 print:p-6">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Print Production Job Card & Retread Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT AREA */}
        <div id="printable-job-card" className="space-y-5 text-slate-900 font-sans">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                <Disc className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  VULCAN-TECH RETREADING SYSTEMS
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  ISO 9001:2015 & RMA Certified Commercial Tyre Retreading Plant
                </p>
                <p className="text-[11px] text-slate-500">
                  Shop Floor Routing • Inspection • Curing • Quality Certification
                </p>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">JOB CARD NUMBER</div>
              <div className="text-lg font-black font-mono text-slate-900">{job.jobNo}</div>
              <div className="text-[11px] text-slate-500 font-mono">Date: {new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Process Classification Highlight */}
          <div className="p-3.5 rounded-lg border-2 border-slate-900 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                ENGINEERING WORKFLOW SPECIFICATION:
              </span>
              <span className="text-base font-black text-slate-900">
                {processConfig.label}
              </span>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {processConfig.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">CURE PROFILE:</span>
              <span className="text-xs font-mono font-bold text-slate-900">{processConfig.cureMethod}</span>
              <div className="text-[11px] font-mono text-slate-600">{processConfig.tempRange} • {processConfig.pressureRange}</div>
            </div>
          </div>

          {/* Customer & Tyre Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 rounded-lg p-3 bg-white">
            <div className="space-y-1 border-r border-slate-200 pr-3">
              <div className="font-bold text-slate-500 uppercase text-[10px]">CUSTOMER & FLEET DETAILS</div>
              <div className="text-sm font-bold text-slate-900">{job.customerName}</div>
              <div>Phone: <strong className="font-mono">{job.customerPhone}</strong></div>
              <div>Fleet ID: <strong className="font-mono">{job.fleetId || 'N/A'}</strong></div>
              <div>Vehicle Reg: <strong className="font-mono uppercase">{job.vehicleNo || 'N/A'}</strong></div>
            </div>

            <div className="space-y-1 pl-1">
              <div className="font-bold text-slate-500 uppercase text-[10px]">TYRE CASING SPECIFICATIONS</div>
              <div className="text-sm font-bold text-slate-900">{job.brand} ({job.size})</div>
              <div>Tyre Serial No: <strong className="font-mono text-blue-700 text-sm">{job.tyreSerial}</strong></div>
              <div>Casing Construction: <strong>{job.casingType}</strong> • {job.casingCondition}</div>
              <div>Applied Tread Pattern: <strong className="text-slate-900">{job.treadPattern}</strong></div>
            </div>
          </div>

          {/* Stage Verification Checkpoints Table */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>Stage Verification & Quality Sign-Off Checkpoints</span>
              <span className="text-[11px] font-mono font-normal text-slate-500">RMA 100% Casing Traceability</span>
            </div>

            <table className="w-full text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px] uppercase">
                <tr>
                  <th className="py-2 px-3 text-left">Stage</th>
                  <th className="py-2 px-3 text-left">Parameters Recorded</th>
                  <th className="py-2 px-3 text-left">Technician Remarks</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3 text-right">Sign / Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {processConfig.stages.filter(s => s !== 'COMPLETED' && s !== 'REJECTED').map(stageKey => {
                  const meta = STAGE_META[stageKey];
                  const log = job.stageHistory.find(h => h.stage === stageKey);
                  const isDone = Boolean(log) || job.stageHistory.some(h => STAGE_META[h.stage]?.order > meta.order);

                  let paramStr = '--';
                  if (stageKey === 'INITIAL_INSPECTION') {
                    paramStr = `Init Depth: ${job.metrics.initialTreadDepthMm || 2.0}mm | Belt: ${job.metrics.originalBeltCondition || 'SOUND'}`;
                  } else if (stageKey === 'BUFFING') {
                    paramStr = `Circumference: ${job.metrics.buffedCircumferenceMm || 3180}mm | Texture: ${job.metrics.buffTextureRMA || 'RMA 3'}`;
                  } else if (stageKey === 'SKIVING_REPAIR') {
                    paramStr = `Skives: ${job.injuries.length} | Cement: ${job.metrics.cementsBatchNo || 'CEM-2026'}`;
                  } else if (stageKey === 'SECTION_CURE') {
                    paramStr = `Spot Cure: ${job.metrics.sectionCureTempC || 150}°C for ${job.metrics.sectionCureDurationMin || 45}m`;
                  } else if (stageKey === 'BUILDING') {
                    paramStr = `Gum: ${job.metrics.cushionGumBatch || 'CG-880'} (1.2mm) | Splice: ${job.metrics.spliceQuality || 'EXCELLENT'}`;
                  } else if (stageKey === 'CURING') {
                    paramStr = `Chamber: ${job.metrics.curingBatchNo || 'VC-104'} | ${job.metrics.cureTempC || 105}°C @ ${job.metrics.curePressureBar || 6.2} bar`;
                  } else if (stageKey === 'FINAL_QC') {
                    paramStr = `Final Depth: ${job.metrics.finalTreadDepthMm || 15.0}mm | Bal: ${job.metrics.balanceChecked ? 'PASS' : 'OK'}`;
                  }

                  return (
                    <tr key={stageKey} className={isDone ? 'bg-white' : 'bg-slate-50/50 text-slate-400'}>
                      <td className="py-2 px-3 font-bold text-slate-800">
                        {meta.label}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-700">
                        {paramStr}
                      </td>
                      <td className="py-2 px-3 text-slate-600 italic">
                        {log?.notes || (isDone ? 'Checked & passed to spec.' : 'Pending')}
                      </td>
                      <td className="py-2 px-3 text-center font-bold">
                        {isDone ? (
                          <span className="text-emerald-700 font-semibold">PASSED</span>
                        ) : (
                          <span className="text-slate-400">QUEUED</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {log?.technicianName || '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Retread Warranty & QC Certificate Section */}
          <div className="border border-emerald-300 rounded-lg p-3.5 bg-emerald-50/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>OFFICIAL RETREAD QUALITY WARRANTY & GATE RELEASE CERTIFICATE</span>
              </div>
              <span className="font-mono font-bold text-emerald-800">
                Cert #{job.metrics.qcCertificateNo || 'QC-CERT-2026-0419'}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              This certifies that Tyre Serial <strong>{job.tyreSerial}</strong> has been processed strictly in accordance with RMA (Rubber Manufacturers Association) industrial standards via <strong>{processConfig.shortLabel}</strong>. Tested for high-pressure casing adhesion, shearography integrity, dynamic balance, and crown tread bonding. Warranted for commercial fleet mileage service.
            </p>
          </div>

          {/* Signatures & Gate Pass Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-xs text-center">
            <div className="space-y-6">
              <div className="h-8 border-b border-dashed border-slate-400"></div>
              <div className="font-bold text-slate-700">Plant Technician Sign-Off</div>
            </div>
            <div className="space-y-6">
              <div className="h-8 border-b border-dashed border-slate-400"></div>
              <div className="font-bold text-slate-700">Master QC Inspector ({job.metrics.qcInspectorName || 'D. Sharma'})</div>
            </div>
            <div className="space-y-6">
              <div className="h-8 border-b border-dashed border-slate-400"></div>
              <div className="font-bold text-slate-700">Customer Fleet Receiver / Gate Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
