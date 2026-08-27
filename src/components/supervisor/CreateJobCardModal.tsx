import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { ProcessType } from '../../types';
import { PROCESS_CONFIG } from '../../utils/processHelpers';
import { Plus, X, Disc, AlertCircle, CheckCircle2, Sparkles, Shield } from 'lucide-react';

export const CreateJobCardModal: React.FC = () => {
  const { activeModal, closeModal, createJobCard, openModal } = useWorkshop();

  const [customerName, setCustomerName] = useState('Highway Express Haulage');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 11223');
  const [fleetId, setFleetId] = useState('HEH-FLEET-14');
  const [vehicleNo, setVehicleNo] = useState('KA-04-MB-7789');

  const [brand, setBrand] = useState('Bridgestone R150');
  const [size, setSize] = useState('295/80R22.5');
  const [tyreSerial, setTyreSerial] = useState(`BS${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [casingType, setCasingType] = useState<'RADIAL' | 'BIAS/NYLON'>('RADIAL');
  const [casingCondition, setCasingCondition] = useState<'Grade A (1st Retread)' | 'Grade B (2nd Retread)' | 'Grade C (Major Repair Casing)'>('Grade A (1st Retread)');
  
  const [processType, setProcessType] = useState<ProcessType>('ONLY_VC');
  const [treadPattern, setTreadPattern] = useState('RIB Highway 15mm (Cold Precured)');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT' | 'FLEET_CONTRACT'>('NORMAL');
  const [estimatedPrice, setEstimatedPrice] = useState(6200);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [initialNotes, setInitialNotes] = useState('Incoming casing verified sound for retreading.');

  if (activeModal !== 'CREATE_JOB') return null;

  const handleProcessChange = (proc: ProcessType) => {
    setProcessType(proc);
    if (proc === 'ONLY_VC') {
      setTreadPattern('RIB Highway 15mm (Cold Precured)');
      setEstimatedPrice(6200);
    } else if (proc === 'ONLY_RT') {
      setTreadPattern('LUG Heavy Traction 20mm (Hot Mold)');
      setEstimatedPrice(6900);
    } else {
      setTreadPattern('TRACTION Super 19mm (Double Process RT+VC)');
      setEstimatedPrice(8800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = createJobCard({
      customerName,
      customerPhone,
      fleetId,
      vehicleNo,
      brand,
      size,
      tyreSerial,
      casingType,
      casingCondition,
      processType,
      treadPattern,
      priority,
      estimatedPrice,
      targetDeliveryDate,
      initialNotes
    });

    closeModal();
    // Open print preview immediately if desired or show details
    openModal('PRINT_JOB', newJob.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Create Tyre Job Card (Intake Registration)
              </h3>
              <p className="text-xs text-slate-500">
                Register casing, assign workflow (Only VC, Only RT, or Double Process), and allocate workshop routing.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SECTION 1: PROCESS SELECTION (THE CORE USP) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Select Production Process Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['ONLY_VC', 'ONLY_RT', 'DOUBLE_PROCESS'] as ProcessType[]).map((type) => {
                const conf = PROCESS_CONFIG[type];
                const isSelected = processType === type;

                return (
                  <div
                    key={type}
                    onClick={() => handleProcessChange(type)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${conf.badgeColor}`}>
                        {conf.shortLabel}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                      {conf.tagline}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {conf.cureMethod}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: CUSTOMER & FLEET DETAILS */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Fleet & Commercial Intake
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer / Fleet Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Contact Phone # *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Fleet ID / Account #
                </label>
                <input
                  type="text"
                  value={fleetId}
                  onChange={(e) => setFleetId(e.target.value)}
                  placeholder="e.g. HSL-FLEET-40"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Vehicle Reg #
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. MH-12-QZ-9102"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TYRE CASING SPECIFICATIONS */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              3. Tyre Casing Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Tyre Serial # (Stamped on Casing) *
                </label>
                <input
                  type="text"
                  required
                  value={tyreSerial}
                  onChange={(e) => setTyreSerial(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Original Brand & Model *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Bridgestone R150, Apollo EnduTrax"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Tyre Size *
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="295/80R22.5">295/80R22.5 (Tubeless Long Haul)</option>
                  <option value="11R22.5">11R22.5 (Tubeless Truck/Bus)</option>
                  <option value="10.00-20">10.00-20 (Tube Type Heavy Cargo)</option>
                  <option value="11.00-20">11.00-20 (Tube Type Mining/Dumper)</option>
                  <option value="12.00R20">12.00R20 (Heavy Tipper / Mining)</option>
                  <option value="315/80R22.5">315/80R22.5 (High Load Super Single)</option>
                  <option value="215/75R17.5">215/75R17.5 (LCV / Mini Bus)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Casing Construction
                </label>
                <select
                  value={casingType}
                  onChange={(e) => setCasingType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="RADIAL">All-Steel Radial Casing</option>
                  <option value="BIAS/NYLON">Bias / Nylon Ply Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Casing Condition Grade
                </label>
                <select
                  value={casingCondition}
                  onChange={(e) => setCasingCondition(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Grade A (1st Retread)">Grade A (1st Retread - Pristine Casing)</option>
                  <option value="Grade B (2nd Retread)">Grade B (2nd Retread - Moderate Wear)</option>
                  <option value="Grade C (Major Repair Casing)">Grade C (Major Repair / Severe Damage)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Target Tread Pattern
                </label>
                <select
                  value={treadPattern}
                  onChange={(e) => setTreadPattern(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="RIB Highway 15mm (Cold Precured)">RIB Highway 15mm (Long Haul Steer/Trailer)</option>
                  <option value="LUG Heavy Traction 18mm (Cold Precured)">LUG Heavy Traction 18mm (Drive Axle)</option>
                  <option value="LUG Heavy Mining 20mm (Hot Mold)">LUG Heavy Mining 20mm (Hot Mold RT)</option>
                  <option value="TRACTION Super 19mm (Double Process RT+VC)">TRACTION Super 19mm (Double Process RT+VC)</option>
                  <option value="MIXED SERVICE Off-Road 22mm">MIXED SERVICE Off-Road 22mm</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: DELIVERY & COMMERCIALS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="NORMAL">Normal Turnaround (3 Days)</option>
                <option value="URGENT">URGENT RUSH (24 Hours)</option>
                <option value="FLEET_CONTRACT">Fleet SLA Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Delivery Date
              </label>
              <input
                type="date"
                value={targetDeliveryDate}
                onChange={(e) => setTargetDeliveryDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Estimated Price (₹)
              </label>
              <input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Initial Intake Notes
            </label>
            <input
              type="text"
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
              placeholder="Visual inspection notes upon casing arrival..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create & Issue Job Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
