import React from 'react';
import { ProcessType, ProcessStage } from '../../types';
import { PROCESS_CONFIG, STAGE_META } from '../../utils/processHelpers';
import { 
  Search, 
  Disc, 
  Wrench, 
  Flame, 
  Layers, 
  Gauge, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const ProcessBadge: React.FC<{ processType: ProcessType; size?: 'sm' | 'md' | 'lg' }> = ({ 
  processType, 
  size = 'md' 
}) => {
  const config = PROCESS_CONFIG[processType];
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  }[size];

  return (
    <span 
      id={`process-badge-${processType.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-md border whitespace-nowrap ${config.badgeColor} ${sizeClasses}`}
      title={config.description}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.shortLabel}
    </span>
  );
};

export const StageBadge: React.FC<{ stage: ProcessStage; size?: 'sm' | 'md' }> = ({ 
  stage, 
  size = 'md' 
}) => {
  const meta = STAGE_META[stage];
  
  const getIcon = () => {
    switch (stage) {
      case 'INITIAL_INSPECTION': return <Search className="w-3.5 h-3.5" />;
      case 'BUFFING': return <Disc className="w-3.5 h-3.5" />;
      case 'SKIVING_REPAIR': return <Wrench className="w-3.5 h-3.5" />;
      case 'SECTION_CURE': return <Flame className="w-3.5 h-3.5" />;
      case 'BUILDING': return <Layers className="w-3.5 h-3.5" />;
      case 'CURING': return <Gauge className="w-3.5 h-3.5" />;
      case 'FINAL_QC': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'REJECTED': return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  const getStyle = () => {
    switch (stage) {
      case 'INITIAL_INSPECTION': return 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800';
      case 'BUFFING': return 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800';
      case 'SKIVING_REPAIR': return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'SECTION_CURE': return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      case 'BUILDING': return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
      case 'CURING': return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'FINAL_QC': return 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'REJECTED': return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800';
    }
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span 
      id={`stage-badge-${stage.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-md border ${getStyle()} ${sizeClasses} whitespace-nowrap`}
    >
      {getIcon()}
      {meta.short}
    </span>
  );
};
