import React, { useMemo } from 'react';
import { 
  PieChart, 
  Store, 
  ShieldCheck
} from 'lucide-react';
import { StockInVoucher } from '../types/inventory';
import { formatKHR, formatNumber } from '../data/inventoryStore';

interface BudgetAnalyticsProps {
  vouchers: StockInVoucher[];
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ vouchers }) => {
  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; count: number; itemsCount: number }>();

    vouchers.forEach(v => {
      v.items.forEach(i => {
        const cat = i.category.trim();
        if (!map.has(cat)) {
          map.set(cat, { total: 0, count: 0, itemsCount: 0 });
        }
        const current = map.get(cat)!;
        current.total += i.totalAmount;
        current.itemsCount++;
        current.count += i.qtyActual;
      });
    });

    const grandTotal = vouchers.reduce((sum, v) => sum + v.grandTotal, 0);

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      itemsCount: data.itemsCount,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
    })).sort((a, b) => b.total - a.total);
  }, [vouchers]);

  // Supplier breakdown
  const supplierStats = useMemo(() => {
    const map = new Map<string, { total: number; voucherCount: number; itemCount: number }>();

    vouchers.forEach(v => {
      const s = v.receivedFrom.trim();
      if (!map.has(s)) {
        map.set(s, { total: 0, voucherCount: 0, itemCount: 0 });
      }
      const entry = map.get(s)!;
      entry.total += v.grandTotal;
      entry.voucherCount++;
      entry.itemCount += v.items.length;
    });

    const grandTotal = vouchers.reduce((sum, v) => sum + v.grandTotal, 0);

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      voucherCount: data.voucherCount,
      itemCount: data.itemCount,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
    })).sort((a, b) => b.total - a.total);
  }, [vouchers]);

  // Entry user breakdown
  const userStats = useMemo(() => {
    const map = new Map<string, { voucherCount: number; total: number }>();
    vouchers.forEach(v => {
      const u = v.enteredBy.trim();
      if (!map.has(u)) {
        map.set(u, { voucherCount: 0, total: 0 });
      }
      const entry = map.get(u)!;
      entry.voucherCount++;
      entry.total += v.grandTotal;
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.voucherCount - a.voucherCount);
  }, [vouchers]);

  const grandTotal = useMemo(() => {
    return vouchers.reduce((sum, v) => sum + v.grandTotal, 0);
  }, [vouchers]);

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-purple-600',
      'bg-rose-600',
      'bg-indigo-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm border border-blue-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-moul">របាយការណ៍វិភាគថវិកា និងការផ្គត់ផ្គង់</h2>
          <p className="text-blue-200 text-xs sm:text-sm mt-1">
            សរុបចំណាយតាមកញ្ចប់កម្មវិធីអប់រំ និងអ្នកផ្គត់ផ្គង់ — ឆ្នាំ២០២៥
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/20 text-center md:text-right">
          <p className="text-xs text-blue-200">ទឹកប្រាក់អនុវត្តសរុប</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-300 font-mono mt-0.5">
            {formatKHR(grandTotal)}
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown and Supplier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>ចំណាយតាមប្រភេទកម្មវិធីអប់រំ (Categories)</span>
            </h3>
            <span className="text-xs text-slate-500">{categoryStats.length} ប្រភេទ</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat, idx) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(idx)}`}></span>
                    {cat.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatKHR(cat.total)} ({cat.percentage.toFixed(1)}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getCategoryColor(idx)} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>ប្រតិបត្តិការ: {cat.itemsCount} មុខ</span>
                  <span>បរិមាណ: {formatNumber(cat.count)} ឯកតា</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suppliers breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>ការទូទាត់ជូនអ្នកផ្គត់ផ្គង់ (Suppliers Distribution)</span>
            </h3>
            <span className="text-xs text-slate-500">{supplierStats.length} ដៃគូ</span>
          </div>

          <div className="space-y-4">
            {supplierStats.map((s) => (
              <div key={s.name} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      សរុប {s.voucherCount} ប័ណ្ណ • {s.itemCount} មុខទំនិញ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-blue-900">{formatKHR(s.total)}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold font-mono">
                      {s.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${s.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Activity List */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>សកម្មភាពបញ្ចូលទិន្នន័យដោយបុគ្គលិកទទួលបន្ទុក</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {userStats.map(u => (
            <div key={u.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-900">{u.name}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{u.voucherCount} ប័ណ្ណបញ្ចូល</p>
              <p className="text-blue-800 font-mono font-bold mt-1 text-[11px]">{formatKHR(u.total)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
