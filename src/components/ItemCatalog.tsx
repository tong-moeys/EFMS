import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Package, 
  Tag, 
  Boxes,
  Coins
} from 'lucide-react';
import { StockInVoucher } from '../types/inventory';
import { formatKHR, formatNumber } from '../data/inventoryStore';

interface ItemCatalogProps {
  vouchers: StockInVoucher[];
  onSelectVoucherByNumber: (vNum: string) => void;
}

interface AggregatedItem {
  name: string;
  category: string;
  unit: string;
  totalQty: number;
  avgUnitPrice: number;
  totalSpent: number;
  vouchersCount: number;
  voucherNumbers: string[];
}

export const ItemCatalog: React.FC<ItemCatalogProps> = ({
  vouchers,
  onSelectVoucherByNumber,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  // Group all items across vouchers
  const aggregatedItems = useMemo(() => {
    const map = new Map<string, AggregatedItem>();

    vouchers.forEach(v => {
      v.items.forEach(item => {
        const key = `${item.itemName.trim()}_${item.unit.trim()}`;
        if (!map.has(key)) {
          map.set(key, {
            name: item.itemName.trim(),
            category: item.category.trim(),
            unit: item.unit.trim(),
            totalQty: 0,
            avgUnitPrice: item.unitPrice,
            totalSpent: 0,
            vouchersCount: 0,
            voucherNumbers: [],
          });
        }
        const entry = map.get(key)!;
        entry.totalQty += item.qtyActual;
        entry.totalSpent += item.totalAmount;
        if (!entry.voucherNumbers.includes(v.voucherNumber)) {
          entry.voucherNumbers.push(v.voucherNumber);
          entry.vouchersCount++;
        }
      });
    });

    // Compute avg unit price
    map.forEach(entry => {
      if (entry.totalQty > 0) {
        entry.avgUnitPrice = Math.round(entry.totalSpent / entry.totalQty);
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [vouchers]);

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    aggregatedItems.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [aggregatedItems]);

  // Filtered
  const filtered = useMemo(() => {
    return aggregatedItems.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'ALL' || i.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [aggregatedItems, search, selectedCat]);

  const totalQuantity = useMemo(() => {
    return filtered.reduce((sum, i) => sum + i.totalQty, 0);
  }, [filtered]);

  const totalExpenditure = useMemo(() => {
    return filtered.reduce((sum, i) => sum + i.totalSpent, 0);
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">មុខទំនិញប្លែកៗ (Unique Catalog Items)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{filtered.length}</p>
            <p className="text-[11px] text-blue-600 mt-0.5">ក្នុងសារពើភ័ណ្ឌ</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">បរិមាណឯកតាសរុប (Total Quantity)</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{formatNumber(totalQuantity)}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">ឯកតាបញ្ចូលឃ្លាំង</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">តម្លៃសារពើភ័ណ្ឌសរុប (Total Value)</p>
            <p className="text-2xl font-bold text-indigo-900 mt-1 font-mono">{formatKHR(totalExpenditure)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">គិតជាប្រាក់រៀល (KHR)</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-catalog"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះសម្ភារៈ បរិក្ខារ ឬប្រភេទ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="select-catalog-category"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none max-w-[200px]"
            >
              <option value="ALL">ប្រភេទចំណាយទាំងអស់</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-slate-900">តារាងស្តុក និងសារពើភ័ណ្ឌទំនិញ</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              {filtered.length} មុខទំនិញ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3.5 text-center w-12">ល.រ</th>
                <th className="py-3 px-3.5 min-w-[240px]">ឈ្មោះសញ្ញា ក្បួន ខ្នាត បរិក្ខារ ទំនិញ</th>
                <th className="py-3 px-3.5 min-w-[180px]">ប្រភេទចំណាយ</th>
                <th className="py-3 px-3.5 text-center w-20">ឯកតាគិត</th>
                <th className="py-3 px-3.5 text-right w-24">ចំនួនសរុប</th>
                <th className="py-3 px-3.5 text-right w-28">ថ្លៃមធ្យម (៛)</th>
                <th className="py-3 px-3.5 text-right w-36">សរុបទឹកប្រាក់ (៛)</th>
                <th className="py-3 px-3.5 min-w-[140px]">ប័ណ្ណពាក់ព័ន្ធ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    មិនមានទិន្នន័យទំនិញត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={`${item.name}-${item.unit}`} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center text-slate-700 font-medium">
                      {item.unit}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatNumber(item.totalQty)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-700">
                      {formatNumber(item.avgUnitPrice)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-blue-900">
                      {formatKHR(item.totalSpent)}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex flex-wrap gap-1">
                        {item.voucherNumbers.map(vNum => (
                          <button
                            key={vNum}
                            onClick={() => onSelectVoucherByNumber(vNum)}
                            className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-200 text-blue-800 text-[10px] font-mono font-bold border border-blue-200 transition-colors"
                          >
                            #{vNum}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <td colSpan={4} className="py-3 px-3.5 text-slate-700 text-right">
                  សរុបរួម:
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-emerald-800">
                  {formatNumber(totalQuantity)}
                </td>
                <td></td>
                <td className="py-3 px-3.5 text-right font-mono text-blue-950 font-bold text-sm">
                  {formatKHR(totalExpenditure)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
