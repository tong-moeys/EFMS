import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  Calendar, 
  User, 
  FileText,
  Warehouse
} from 'lucide-react';
import { StockInVoucher } from '../types/inventory';
import { formatKHR, formatNumber } from '../data/inventoryStore';

interface VoucherDetailModalProps {
  voucher: StockInVoucher | null;
  onClose: () => void;
  onPrint: (voucher: StockInVoucher) => void;
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  onClose,
  onPrint,
}) => {
  if (!voucher) return null;

  const exportCSV = () => {
    const headers = ["ល.រ", "ឈ្មោះទំនិញ/សម្ភារៈ", "ប្រភេទ", "ឯកតាគិត", "ចំនួនតាមសក្ខីបត្រ", "ចំនួនបញ្ចូលពិតប្រាកដ", "ថ្លៃឯកតា(រៀល)", "សរុបទឹកប្រាក់(រៀល)"];
    const rows = voucher.items.map(item => [
      item.lineNumber,
      `"${item.itemName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.unit,
      item.qtyReference,
      item.qtyActual,
      item.unitPrice,
      item.totalAmount,
    ]);

    const csvContent = "\uFEFF" + [
      [`ប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ លេខ: ${voucher.voucherNumber}`],
      [`កាលបរិច្ឆេទ: ${voucher.stockDate}`],
      [`បានទទួលពី: ${voucher.receivedFrom}`],
      [`លេខសក្ខីបត្រ: ${voucher.invoiceNumber}`],
      [`អ្នកបញ្ចូល: ${voucher.enteredBy}`],
      [],
      headers,
      ...rows,
      [],
      ["", "", "", "", "", "ទឹកប្រាក់សរុប:", "", voucher.grandTotal]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Voucher_${voucher.voucherNumber}_${voucher.stockDate.replace(/[\/\-]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg border border-white/20">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-moul tracking-wide text-white">
                លម្អិតប្រតិបត្តិការបញ្ចូលសម្ភារៈ ទំនិញ
              </h2>
              <div className="text-xs text-blue-200 flex items-center gap-2 mt-0.5">
                <span>ប័ណ្ណលេខ: <strong className="text-white font-mono">{voucher.voucherNumber}</strong></span>
                <span>•</span>
                <span>កាលបរិច្ឆេទ: <strong className="text-white">{voucher.stockDate}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-print"
              onClick={() => onPrint(voucher)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold border border-blue-600 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">បោះពុម្ពប័ណ្ណ</span>
            </button>

            <button
              id="btn-modal-csv"
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ទាញយក CSV</span>
            </button>

            <button
              id="btn-modal-close"
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          {/* Metadata Grid (Matching original Cambodian MoEYS form) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                អង្គភាព / ស្ថាប័ន
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.organization}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5 text-indigo-600" />
                បញ្ចូលនៅឃ្លាំង / ទីតាំង
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.warehouse}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                កាលបរិច្ឆេទបញ្ជីបញ្ចូល
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.stockDate}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                អ្នកបញ្ចូលទិន្នន័យ
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.enteredBy}
              </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-medium">
                បានទទួលពី (អ្នកផ្គត់ផ្គង់ / អាជីវកម្ម)
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.receivedFrom}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">
                តាម (ប្រភេទសក្ខីបត្រដើម)
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80">
                {voucher.documentType || 'Invoice'}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">
                លេខ & កាលបរិច្ឆេទវិក្កយបត្រ
              </label>
              <div className="font-semibold text-slate-800 text-sm bg-slate-50 p-2 rounded border border-slate-200/80 flex items-center justify-between">
                <span>លេខ: {voucher.invoiceNumber || '—'}</span>
                <span className="text-slate-500 font-normal text-xs">{voucher.invoiceDate}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span>តារាងមុខទំនិញ និងសម្ភារៈក្នុងប័ណ្ណ</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  {voucher.items.length} មុខ
                </span>
              </div>
              <div className="text-xs text-slate-500">
                ឆ្នាំថវិកា: <strong className="text-slate-700">{voucher.fiscalYear}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-200/80 text-slate-700 font-semibold border-b border-slate-300">
                    <th className="py-2.5 px-3 text-center w-12 border-r border-slate-300">ល.រ</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 min-w-[220px]">
                      ឈ្មោះសញ្ញា ក្បួន ខ្នាត បរិក្ខារ ទំនិញ
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300 min-w-[160px]">ប្រភេទចំណាយ</th>
                    <th className="py-2.5 px-3 text-center border-r border-slate-300 w-20">ឯកតាគិត</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 w-24">
                      ចំនួនតាម<br />សក្ខីបត្រ
                    </th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 w-24">
                      ចំនួនបញ្ចូល<br />ពិតប្រាកដ
                    </th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-300 w-28">
                      ថ្លៃឯកតា (៛)
                    </th>
                    <th className="py-2.5 px-3 text-right w-32">
                      សរុបទឹកប្រាក់ (៛)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {voucher.items.map((item, idx) => (
                    <tr 
                      key={item.id || idx}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-slate-50/60 hover:bg-blue-50/40'}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium border-r border-slate-200">
                        {item.lineNumber}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                        {item.itemName}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700 font-medium border-r border-slate-200">
                        {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600 border-r border-slate-200">
                        {formatNumber(item.qtyReference)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700 border-r border-slate-200">
                        {formatNumber(item.qtyActual)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 border-r border-slate-200">
                        {formatNumber(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatNumber(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                    <td colSpan={7} className="py-3 px-4 text-right text-slate-700 border-r border-slate-300">
                      សរុបទឹកប្រាក់រួមទាំងអស់ (Grand Total):
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-blue-900 bg-blue-50/80">
                      {formatKHR(voucher.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            ប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ ផ្លូវការ • សាលាបឋមសិក្សា រោគ
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-footer-close"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              បិទផ្ទាំង (Close)
            </button>
            <button
              id="btn-footer-print"
              onClick={() => onPrint(voucher)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>ទម្រង់បោះពុម្ពផ្លូវការ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
