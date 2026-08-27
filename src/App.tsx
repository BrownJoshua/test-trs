import React from 'react';
import { WorkshopProvider, useWorkshop } from './context/WorkshopContext';
import { Header } from './components/common/Header';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { TechnicianWorkstation } from './components/technician/TechnicianWorkstation';
import { CreateJobCardModal } from './components/supervisor/CreateJobCardModal';
import { JobCardPrintModal } from './components/supervisor/JobCardPrintModal';
import { Disc, ShieldCheck, Wrench, Layers } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { userRole } = useWorkshop();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header with Navigation & Role Toggle */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {userRole === 'SUPERVISOR' ? (
          <SupervisorDashboard />
        ) : (
          <TechnicianWorkstation />
        )}
      </main>

      {/* Modals */}
      <CreateJobCardModal />
      <JobCardPrintModal />

      {/* Footer with Standards & Quick Summary */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 text-slate-500 text-xs mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              VT
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Vulcan-Tech Tyre Retreading ERP
            </span>
            <span className="text-slate-400">|</span>
            <span>RMA & ISO 9001:2015 Compliant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Only VC (Cold Chamber)
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Only RT (Hot Matrix)
            </span>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Double Process (Dual Stage)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <WorkshopProvider>
      <MainLayout />
    </WorkshopProvider>
  );
}
