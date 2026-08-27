import React, { useState } from 'react';
import { TyreInjury } from '../../types';
import { Plus, Trash2, CheckCircle, AlertTriangle, Disc, Wrench } from 'lucide-react';

interface TyreDamageMapperProps {
  injuries: TyreInjury[];
  onAddInjury: (injury: Omit<TyreInjury, 'id'>) => void;
  onUpdateInjury: (id: string, updates: Partial<TyreInjury>) => void;
  onDeleteInjury: (id: string) => void;
  readOnly?: boolean;
}

export const TyreDamageMapper: React.FC<TyreDamageMapperProps> = ({
  injuries,
  onAddInjury,
  onUpdateInjury,
  onDeleteInjury,
  readOnly = false
}) => {
  const [selectedZone, setSelectedZone] = useState<TyreInjury['zone']>('CROWN');
  const [depthMm, setDepthMm] = useState<number>(4.0);
  const [description, setDescription] = useState<string>('Nail puncture in center tread zone');
  const [patchRecommended, setPatchRecommended] = useState<string>('Radial Patch RP-12');
  const [angleDeg, setAngleDeg] = useState<number>(45);

  const zones: { id: TyreInjury['zone']; label: string; recommendedPatch: string }[] = [
    { id: 'CROWN', label: 'Crown / Tread Center', recommendedPatch: 'Radial Patch RP-12 / RP-20' },
    { id: 'SHOULDER_L', label: 'Left Shoulder', recommendedPatch: 'Radial Section Patch RP-25' },
    { id: 'SHOULDER_R', label: 'Right Shoulder', recommendedPatch: 'Radial Section Patch RP-25' },
    { id: 'SIDEWALL_L', label: 'Left Sidewall', recommendedPatch: 'Heavy Section Patch RP-35 (Requires RT Section Spot Cure)' },
    { id: 'SIDEWALL_R', label: 'Right Sidewall', recommendedPatch: 'Heavy Section Patch RP-35 (Requires RT Section Spot Cure)' },
    { id: 'BEAD_L', label: 'Left Bead Area', recommendedPatch: 'Bead Repair Wrap / Inspection Only' },
    { id: 'BEAD_R', label: 'Right Bead Area', recommendedPatch: 'Bead Repair Wrap / Inspection Only' },
    { id: 'INNERLINER', label: 'Innerliner / Under-Ply', recommendedPatch: 'Innerliner Sealer & Radial Patch' }
  ];

  const handleZoneSelect = (z: TyreInjury['zone']) => {
    setSelectedZone(z);
    const found = zones.find(item => item.id === z);
    if (found) {
      setPatchRecommended(found.recommendedPatch.split(' ')[0] + ' ' + (found.recommendedPatch.split(' ')[1] || ''));
      if (z.includes('SIDEWALL')) {
        setDescription('Sidewall curb cut / gouge, multi-ply inspection required');
        setDepthMm(7.5);
      } else if (z.includes('SHOULDER')) {
        setDescription('Shoulder stone drill cut, steel cords check');
        setDepthMm(5.5);
      } else {
        setDescription('Crown puncture skiving injury');
        setDepthMm(4.0);
      }
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddInjury({
      zone: selectedZone,
      angleDeg,
      depthMm: Number(depthMm),
      description,
      patchRecommended,
      repaired: false,
      notes: ''
    });

    // Reset default
    setDescription('Crown puncture skiving injury');
    setDepthMm(4.0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Tyre Injury & Damage Mapping
          </h4>
          <p className="text-xs text-slate-500">
            Interactive casing defect logger for Skiving, Section Repair & Patching records.
          </p>
        </div>
        <div className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          Total Logged: <strong className="text-blue-600 dark:text-blue-400">{injuries.length}</strong> ({injuries.filter(i => i.repaired).length} Repaired)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Schematic Diagram */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl p-4 text-white flex flex-col items-center justify-center relative min-h-[260px] shadow-inner">
          <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider text-center">
            Tyre Cross-Section & Radial Map
          </div>

          {/* Graphical Representation of Tyre Cross-Section */}
          <div className="relative w-60 h-44 border-2 border-slate-700 rounded-t-full rounded-b-lg flex flex-col items-center justify-between p-3 bg-slate-950/60 shadow-lg">
            {/* Crown / Top Tread Zone */}
            <button
              type="button"
              onClick={() => handleZoneSelect('CROWN')}
              className={`w-4/5 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1 border ${
                selectedZone === 'CROWN'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              👑 CROWN (Tread Zone)
              {injuries.filter(i => i.zone === 'CROWN').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] text-black font-bold flex items-center justify-center">
                  {injuries.filter(i => i.zone === 'CROWN').length}
                </span>
              )}
            </button>

            {/* Shoulders (Left & Right) */}
            <div className="w-full flex justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => handleZoneSelect('SHOULDER_L')}
                className={`flex-1 py-1 rounded text-[11px] font-semibold transition border ${
                  selectedZone === 'SHOULDER_L'
                    ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ◀ Left Shoulder
              </button>
              <button
                type="button"
                onClick={() => handleZoneSelect('SHOULDER_R')}
                className={`flex-1 py-1 rounded text-[11px] font-semibold transition border ${
                  selectedZone === 'SHOULDER_R'
                    ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Right Shoulder ▶
              </button>
            </div>

            {/* Sidewalls (Left & Right) */}
            <div className="w-full flex justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => handleZoneSelect('SIDEWALL_L')}
                className={`flex-1 py-1 rounded text-[11px] font-semibold transition border ${
                  selectedZone === 'SIDEWALL_L'
                    ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ◀ Left Sidewall
              </button>
              <button
                type="button"
                onClick={() => handleZoneSelect('SIDEWALL_R')}
                className={`flex-1 py-1 rounded text-[11px] font-semibold transition border ${
                  selectedZone === 'SIDEWALL_R'
                    ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Right Sidewall ▶
              </button>
            </div>

            {/* Bead & Innerliner Zone */}
            <div className="w-full flex justify-between gap-1 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleZoneSelect('BEAD_L')}
                className={`px-2 py-0.5 rounded text-[10px] transition border ${
                  selectedZone === 'BEAD_L' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bead-L
              </button>
              <button
                type="button"
                onClick={() => handleZoneSelect('INNERLINER')}
                className={`px-2 py-0.5 rounded text-[10px] transition border ${
                  selectedZone === 'INNERLINER' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Innerliner
              </button>
              <button
                type="button"
                onClick={() => handleZoneSelect('BEAD_R')}
                className={`px-2 py-0.5 rounded text-[10px] transition border ${
                  selectedZone === 'BEAD_R' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bead-R
              </button>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 text-center">
            Active Selected: <span className="text-white font-bold">{selectedZone.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Injury Entry Form (when not readonly) & Plotted List */}
        <div className="lg:col-span-7 space-y-3">
          {!readOnly && (
            <form onSubmit={handleAdd} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Add Injury in <span className="text-blue-600 dark:text-blue-400">{selectedZone}</span> Zone:
                </span>
                <span className="text-[11px] text-slate-500">
                  Angle: {angleDeg}°
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Injury Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Nail cut, belt exposed"
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Depth (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="25"
                    value={depthMm}
                    onChange={(e) => setDepthMm(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Patch Recommended</label>
                  <select
                    value={patchRecommended}
                    onChange={(e) => setPatchRecommended(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Radial Patch RP-10">Radial Patch RP-10 (Small Crown)</option>
                    <option value="Radial Patch RP-12">Radial Patch RP-12 (Standard Nail Hole)</option>
                    <option value="Radial Patch RP-20">Radial Patch RP-20 (Crown 2-Ply Cut)</option>
                    <option value="Radial Section Patch RP-25">Radial Section Patch RP-25 (Shoulder)</option>
                    <option value="Heavy Section Patch RP-35">Heavy Section Patch RP-35 (Sidewall - Double Process)</option>
                    <option value="Bias Patch BP-04">Bias Patch BP-04 (Nylon Casing)</option>
                    <option value="Stem Plug Only">Stem Plug & Cushion Gum Filling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Circumference Angle (0°-360°)</label>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full h-4 mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Injury to Job Card</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Logged Injuries */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {injuries.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded border border-dashed border-slate-200 dark:border-slate-700">
                No casing injuries or skiving defects logged for this tyre.
              </div>
            ) : (
              injuries.map((inj, idx) => (
                <div
                  key={inj.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition ${
                    inj.repaired
                      ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {inj.zone} ({inj.angleDeg}°)
                        </span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                          {inj.depthMm}mm depth
                        </span>
                        {inj.repaired ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
                            <CheckCircle className="w-3 h-3" /> Repaired & Patched
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5 text-[11px]">
                            <AlertTriangle className="w-3 h-3" /> Pending Repair
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                        {inj.description} • <strong className="text-slate-700 dark:text-slate-300">{inj.patchRecommended}</strong>
                      </p>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateInjury(inj.id, { repaired: !inj.repaired })}
                        className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                          inj.repaired
                            ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                      >
                        <Wrench className="w-3 h-3" />
                        <span>{inj.repaired ? 'Mark Pending' : 'Mark Repaired'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteInjury(inj.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
