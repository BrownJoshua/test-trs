import React, { useState, useEffect } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { 
  Wrench, 
  Shield, 
  HardHat, 
  Plus, 
  Search, 
  RotateCcw, 
  Download, 
  Upload, 
  Layers, 
  Gauge, 
  Disc, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { WorkshopStation } from '../../types';

export const Header: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    activeStation, 
    setActiveStation, 
    activeTechnician, 
    setActiveTechnician, 
    technicians, 
    jobCards, 
    inventory,
    openModal, 
    searchQuery, 
    setSearchQuery,
    resetAllData,
    exportDataJSON,
    importDataJSON
  } = useWorkshop();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showDataMenu, setShowDataMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const lowStockCount = inventory.filter(i => i.stock <= i.minThreshold).length;
  const activeWipCount = jobCards.filter(j => j.status === 'IN_PROGRESS').length;

  const handleExport = () => {
    const dataStr = exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tyre-retread-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDataMenu(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const ok = importDataJSON(text);
          if (ok) {
            alert('ERP Data imported successfully!');
          } else {
            alert('Invalid JSON backup file.');
          }
        }
      };
      reader.readAsText(file);
    }
    setShowDataMenu(false);
  };

  const stations: { id: WorkshopStation; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'All Bays', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'INSPECTION', label: '1. Inspection', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'BUFFING', label: '2. Buffing', icon: <Disc className="w-3.5 h-3.5" /> },
    { id: 'SKIVING_REPAIR', label: '3. Skiving & Repair', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'BUILDING', label: '4. Tread Building', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'CURING', label: '5. Autoclave / Mold', icon: <Gauge className="w-3.5 h-3.5" /> },
    { id: 'FINAL_QC', label: '6. Final QC', icon: <Shield className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Plant Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md ring-1 ring-white/10">
            <Disc className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                VULCAN-TECH <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">ERP</span>
              </h1>
              <span className="hidden md:inline-flex items-center text-xs text-slate-400 gap-1 pl-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Plant Online
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Tyre Retreading Unit: <span className="text-blue-300 font-medium">Only VC</span> • <span className="text-amber-300 font-medium">Only RT</span> • <span className="text-purple-300 font-medium">Double Process</span>
            </p>
          </div>
        </div>

        {/* Global Search & Quick Barcode Scanner */}
        <div className="flex-1 max-w-md min-w-[200px] hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-tyre-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Job No, Tyre Serial, Fleet, Brand (e.g. BS984210087)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Clock & WIP Status */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{currentTime}</span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-400 font-medium">{activeWipCount} WIP</span>
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-amber-400 font-medium pl-1" title={`${lowStockCount} items below minimum safety threshold`}>
                <AlertCircle className="w-3 h-3" />
                {lowStockCount} Low
              </span>
            )}
          </div>

          {/* Role Toggle Button */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-800 border border-slate-700">
            <button
              id="role-btn-supervisor"
              onClick={() => setUserRole('SUPERVISOR')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                userRole === 'SUPERVISOR'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Supervisor</span>
            </button>
            <button
              id="role-btn-technician"
              onClick={() => setUserRole('TECHNICIAN')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                userRole === 'TECHNICIAN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Technician</span>
            </button>
          </div>

          {/* Create Job Button */}
          <button
            id="btn-create-job-modal"
            onClick={() => openModal('CREATE_JOB')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tyre Job</span>
          </button>

          {/* Technician User Dropdown */}
          <div className="relative">
            <select
              id="technician-user-select"
              value={activeTechnician.id}
              onChange={(e) => {
                const found = technicians.find(t => t.id === e.target.value);
                if (found) setActiveTechnician(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[130px] truncate"
              title="Active Operator Profile"
            >
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>
                  👤 {tech.name} ({tech.code})
                </option>
              ))}
            </select>
          </div>

          {/* Data Menu */}
          <div className="relative">
            <button
              id="btn-erp-data-settings"
              onClick={() => setShowDataMenu(!showDataMenu)}
              className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Data Backup & ERP Options"
            >
              <FileText className="w-4 h-4" />
            </button>

            {showDataMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs text-slate-200">
                <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-700">
                  Data & Backup
                </div>
                <button
                  onClick={handleExport}
                  className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export Workshop JSON</span>
                </button>
                <a
                  href="/tyre-retreading-erp.html"
                  download="tyre-retreading-erp.html"
                  className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Standalone HTML</span>
                </a>
                <a
                  href="/tyre-retreading-erp.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-200"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open Standalone HTML View</span>
                </a>
                <label className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Backup JSON</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <div className="border-t border-slate-700 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm('Reset workshop data to factory demonstration values?')) {
                      resetAllData();
                      setShowDataMenu(false);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Demo Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Header: Station Filter for Technicians & Supervisors */}
      {userRole === 'TECHNICIAN' && (
        <div className="bg-slate-800/90 border-t border-slate-700/60 px-4 sm:px-6 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-emerald-400">Shop Floor Bay:</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                {stations.map(station => (
                  <button
                    key={station.id}
                    id={`station-tab-${station.id.toLowerCase()}`}
                    onClick={() => setActiveStation(station.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                      activeStation === station.id
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {station.icon}
                    <span>{station.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-400 hidden md:block">
              Logged in as: <strong className="text-slate-200">{activeTechnician.name}</strong> • Station: <span className="text-emerald-300">{activeTechnician.assignedStation}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
