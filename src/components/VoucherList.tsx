import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Printer, 
  Calendar, 
  Store, 
  Layers, 
  ArrowUpDown, 
  FileCheck2, 
  Receipt 
} from 'lucide-react';
import { StockInVoucher } from '../types/inventory';
import { formatKHR } from '../data/inventoryStore';

interface VoucherListProps {
  vouchers: StockInVoucher[];
  onSelectVoucher: (v: StockInVoucher) => void;
  onPrintVoucher: (v: StockInVoucher) => void;
  onNewVoucher: () => void;
}

export const VoucherList: React.FC<VoucherListProps> = ({
  vouchers,
  onSelectVoucher,
  onPrintVoucher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'voucherNumber' | 'date' | 'total'>('voucherNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Extract unique suppliers
  const suppliers = useMemo(() => {
    const set = new Set<string>();
    vouchers.forEach(v => {
      if (v.receivedFrom) set.add(v.receivedFrom);
    });
    return Array.from(set);
  }, [vouchers]);

  // Extract unique months
  const months = useMemo(() => {
    const set = new Set<string>();
    vouchers.forEach(v => {
      const match = v.stockDate.match(/(Mar|Aug|Jul|Jun|May|Apr|Feb|Jan|Sep|Oct|Nov|Dec|\d{2})/i);
      if (match) set.add(match[0]);
    });
    return Array.from(set);
  }, [vouchers]);

  // Filter and Sort
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const matchQuery = 
        v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.receivedFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.enteredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.items.some(i => i.itemName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSupplier = selectedSupplier === 'ALL' || v.receivedFrom === selectedSupplier;
      const matchMonth = selectedMonth === 'ALL' || v.stockDate.toLowerCase().includes(selectedMonth.toLowerCase());

      return matchQuery && matchSupplier && matchMonth;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'voucherNumber') {
        comparison = parseInt(a.voucherNumber, 10) - parseInt(b.voucherNumber, 10);
      } else if (sortField === 'total') {
        comparison = a.grandTotal - b.grandTotal;
      } else {
        comparison = a.stockDate.localeCompare(b.stockDate);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [vouchers, searchQuery, selectedSupplier, selectedMonth, sortField, sortOrder]);

  const totalFilteredAmount = useMemo(() => {
    return filteredVouchers.reduce((sum, v) => sum + v.grandTotal, 0);
  }, [filteredVouchers]);

  const totalFilteredItems = useMemo(() => {
    return filteredVouchers.reduce((sum, v) => sum + v.items.length, 0);
  }, [filteredVouchers]);

  return (
    <div className="space-y-5">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">ប័ណ្ណបញ្ចូលសរុប (Vouchers)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{filteredVouchers.length}</p>
            <p className="text-[11px] text-blue-600 mt-0.5 font-medium">ក្នុងប្រព័ន្ធ ២០២៥</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">មុខទំនិញប្រតិបត្តិការ (Items)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalFilteredItems}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">បានត្រួតពិនិត្យរួចរាល់</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between sm:col-span-2">
          <div>
            <p className="text-xs font-medium text-slate-500">ទឹកប្រាក់សរុបទាំងអស់ (Total Expenditure)</p>
            <p className="text-2xl font-bold text-blue-900 mt-1 font-mono">{formatKHR(totalFilteredAmount)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">គិតជាប្រាក់រៀលកម្ពុជា (KHR)</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-voucher"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមលេខប័ណ្ណ, អ្នកផ្គត់ផ្គង់, អ្នកបញ្ចូល ឬឈ្មោះទំនិញ..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                សម្អាត
              </button>
            )}
          </div>

          {/* Quick Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="select-supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none max-w-[160px] truncate"
              >
                <option value="ALL">អ្នកផ្គត់ផ្គង់ទាំងអស់</option>
                {suppliers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="select-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none"
              >
                <option value="ALL">ខែទាំងអស់</option>
                {months.map(m => (
                  <option key={m} value={m}>ខែ {m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="select-sort"
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split('-') as ['voucherNumber' | 'date' | 'total', 'asc' | 'desc'];
                  setSortField(f);
                  setSortOrder(o);
                }}
                className="bg-transparent text-slate-700 focus:outline-none"
              >
                <option value="voucherNumber-asc">លេខប័ណ្ណ (០១ ទៅ ២០)</option>
                <option value="voucherNumber-desc">លេខប័ណ្ណ (២០ ទៅ ០១)</option>
                <option value="total-desc">ទឹកប្រាក់ (ច្រើន ទៅ តិច)</option>
                <option value="total-asc">ទឹកប្រាក់ (តិច ទៅ ច្រើន)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-slate-900">តារាងប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              បង្ហាញ {filteredVouchers.length} ប័ណ្ណ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3.5 text-center w-16">លេខប័ណ្ណ</th>
                <th className="py-3 px-3.5 min-w-[110px]">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-3.5 min-w-[220px]">បានទទួលពី (អ្នកផ្គត់ផ្គង់)</th>
                <th className="py-3 px-3.5 min-w-[130px]">សក្ខីបត្រ / វិក្កយបត្រ</th>
                <th className="py-3 px-3.5 text-center w-24">ចំនួនមុខទំនិញ</th>
                <th className="py-3 px-3.5 min-w-[120px]">អ្នកបញ្ចូល</th>
                <th className="py-3 px-3.5 text-right w-36">ទឹកប្រាក់សរុប (៛)</th>
                <th className="py-3 px-3.5 text-center w-32">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">រកមិនឃើញប័ណ្ណដែលត្រូវនឹងការស្វែងរកទេ</p>
                    <p className="text-xs mt-1">សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ ឬជ្រើសរើសតម្រងឡើងវិញ</p>
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => (
                  <tr 
                    key={voucher.voucherNumber}
                    className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectVoucher(voucher)}
                  >
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-100/80 text-blue-900 font-mono font-bold text-xs border border-blue-200">
                        {voucher.voucherNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-700">
                      {voucher.stockDate}
                    </td>
                    <td className="py-3 px-3.5">
                      <p className="font-semibold text-slate-900 line-clamp-1">{voucher.receivedFrom}</p>
                      <p className="text-[11px] text-slate-500">{voucher.warehouse}</p>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      <p className="font-mono text-xs text-slate-800">
                        {voucher.invoiceNumber ? `លេខ: ${voucher.invoiceNumber}` : '—'}
                      </p>
                      <p className="text-[11px] text-slate-400">{voucher.invoiceDate}</p>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono text-[11px] border border-slate-200">
                        {voucher.items.length} មុខ
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 font-medium">
                      {voucher.enteredBy}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-blue-900 text-sm">
                      {formatKHR(voucher.grandTotal)}
                    </td>
                    <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-view-${voucher.voucherNumber}`}
                          onClick={() => onSelectVoucher(voucher)}
                          title="មើលលម្អិតប័ណ្ណ (View Detail)"
                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white rounded-md border border-blue-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-print-${voucher.voucherNumber}`}
                          onClick={() => onPrintVoucher(voucher)}
                          title="បោះពុម្ពប័ណ្ណ (Print Voucher)"
                          className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white rounded-md border border-slate-200 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td colSpan={4} className="py-3 px-3.5 text-slate-700">
                  សរុបប័ណ្ណដែលបានបង្ហាញ: <span className="font-mono text-blue-900">{filteredVouchers.length}</span> ប័ណ្ណ
                </td>
                <td className="py-3 px-3.5 text-center font-mono text-slate-800">
                  {totalFilteredItems} មុខ
                </td>
                <td className="py-3 px-3.5 text-right text-slate-700">
                  ទឹកប្រាក់សរុប:
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-sm text-blue-950 font-bold">
                  {formatKHR(totalFilteredAmount)}
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
