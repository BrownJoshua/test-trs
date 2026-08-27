import React, { useState } from 'react';
import { useWorkshop } from '../../context/WorkshopContext';
import { InventoryItem } from '../../types';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Disc, 
  Wrench, 
  RefreshCw, 
  DollarSign, 
  Search,
  Filter
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { inventory, updateInventoryStock, restockItem } = useWorkshop();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [restockItemData, setRestockItemData] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(20);
  const [restockLot, setRestockLot] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'All Materials' },
    { id: 'TREAD_RUBBER', label: 'Tread Rubber Rolls & Slabs' },
    { id: 'CUSHION_GUM', label: 'Cushion Gum Rolls' },
    { id: 'CEMENT', label: 'Vulcanizing Solutions' },
    { id: 'REPAIR_PATCHES', label: 'Radial & Bias Patches' },
    { id: 'ENVELOPES', label: 'Curing Envelopes & Bladders' }
  ];

  const filteredItems = inventory.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.code.toLowerCase().includes(q) && !item.lotNo.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalValuation = inventory.reduce((sum, item) => sum + (item.stock * item.unitCost), 0);
  const lowStockItems = inventory.filter(i => i.stock <= i.minThreshold);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItemData || restockQty <= 0) return;
    restockItem(restockItemData.id, Number(restockQty), restockLot || restockItemData.lotNo);
    setRestockItemData(null);
    setRestockQty(20);
    setRestockLot('');
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Workshop Materials & Raw Inventory ERP
            </h3>
            {lowStockItems.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1 border border-amber-300">
                <AlertTriangle className="w-3 h-3" />
                {lowStockItems.length} Low Stock Alert
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking raw materials for Only VC (Precured), Only RT (Camelback Hot Matrix), and Double Process (Section Patches & Dual Curing).
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-sans">Total Stock Items</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{inventory.length} SKUs</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-sans">Total Material Valuation</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{totalValuation.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search material SKU or Lot #..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isLow = item.stock <= item.minThreshold;
          const stockHealthPct = Math.min(100, Math.round((item.stock / (item.minThreshold * 3)) * 100));

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border bg-white dark:bg-slate-900 transition shadow-sm space-y-3 ${
                isLow
                  ? 'border-amber-400 dark:border-amber-600/60 bg-amber-50/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.code}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {item.name}
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.applicableProcess === 'ONLY_VC' ? 'bg-blue-100 text-blue-800' :
                  item.applicableProcess === 'ONLY_RT' ? 'bg-amber-100 text-amber-800' :
                  item.applicableProcess === 'DOUBLE_PROCESS' ? 'bg-purple-100 text-purple-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {item.applicableProcess === 'ALL' ? 'ALL PROCESSES' : item.applicableProcess.replace('_', ' ')}
                </span>
              </div>

              {item.specs && (
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {item.specs}
                </p>
              )}

              {/* Stock Bar & Numbers */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Available Stock:</span>
                  <span className={`font-mono font-bold text-sm ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.stock} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${stockHealthPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Min Safety Limit: {item.minThreshold} {item.unit}</span>
                  <span>Unit Cost: ₹{item.unitCost}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500 font-mono">Lot: <strong className="text-slate-700 dark:text-slate-300">{item.lotNo}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setRestockItemData(item);
                    setRestockLot(item.lotNo);
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Restock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESTOCK MODAL */}
      {restockItemData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              Restock Material Batch
            </h3>
            <p className="text-xs text-slate-500">
              Restocking: <strong>{restockItemData.name}</strong> ({restockItemData.code})
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Quantity to Add ({restockItemData.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Supplier / Manufacturing Lot #
                </label>
                <input
                  type="text"
                  value={restockLot}
                  onChange={(e) => setRestockLot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRestockItemData(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Inward Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
