import React, { useState } from 'react';
import { X, Plus, Trash2, Save, FilePlus2 } from 'lucide-react';
import { StockInVoucher, InventoryItem } from '../types/inventory';
import { formatKHR } from '../data/inventoryStore';

interface NewVoucherModalProps {
  onClose: () => void;
  onSave: (voucher: StockInVoucher) => void;
  nextVoucherNumber: string;
}

const DEFAULT_CATEGORIES = [
  'សម្ភារៈរៀន និងបង្រៀន',
  'កិច្ចដំណើរការរដ្ឋបាល',
  'ការថែទាំ និងជួសជុលផ្សេងៗ',
  'ការចូលរៀនដោយសមធម៌និងបង្ការសិស្សបោះបង់',
  'អប់រំបំណិនជីវិត កីឡា ការងារយុវជន និងកុមារ',
  'ការកែលម្អបរិស្ថាន និងទីធ្លាកម្សាន្ត',
];

const DEFAULT_UNITS = ['ដប', 'កេស', 'ដុំ', 'ប្រអប់', 'សន្លឹក', 'ដើម', 'ឈុត', 'គូ', 'ធុង', 'កញ្ចប់', 'គីឡូ', 'ក្បាល', 'ឡូ', 'ផ្ទាំង'];

export const NewVoucherModal: React.FC<NewVoucherModalProps> = ({
  onClose,
  onSave,
  nextVoucherNumber,
}) => {
  const [voucherNumber, setVoucherNumber] = useState(nextVoucherNumber);
  const [stockDate, setStockDate] = useState(() => {
    const d = new Date();
    return `${d.getDate()}/${d.toLocaleString('en-US', { month: 'short' })}/${d.getFullYear()}`;
  });
  const [receivedFrom, setReceivedFrom] = useState('បណ្ណាគា ភ្នំស្រុក លក់សម្ភារៈការិយាល័យ');
  const [documentType, setDocumentType] = useState('Invoice');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [enteredBy, setEnteredBy] = useState('ស្វាង មនោរម្យ');
  const [organization] = useState('សាលាបឋមសិក្សា រោគ');
  const [warehouse] = useState('សាលាបឋមសិក្សា រោគ');
  const [fiscalYear] = useState('2025');

  const [items, setItems] = useState<Omit<InventoryItem, 'id' | 'lineNumber'>[]>([
    {
      itemName: '',
      category: 'សម្ភារៈរៀន និងបង្រៀន',
      unit: 'ដប',
      qtyReference: 1,
      qtyActual: 1,
      unitPrice: 0,
      totalAmount: 0,
    }
  ]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    const row = { ...updated[index], [field]: value };

    if (field === 'qtyActual' || field === 'unitPrice') {
      const qty = field === 'qtyActual' ? parseFloat(value) || 0 : row.qtyActual;
      const price = field === 'unitPrice' ? parseFloat(value) || 0 : row.unitPrice;
      row.totalAmount = qty * price;
    }

    updated[index] = row;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        itemName: '',
        category: 'សម្ភារៈរៀន និងបង្រៀន',
        unit: 'ដុំ',
        qtyReference: 1,
        qtyActual: 1,
        unitPrice: 0,
        totalAmount: 0,
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherNumber.trim()) return;

    const formattedItems: InventoryItem[] = items.map((it, idx) => ({
      id: `${voucherNumber}-${idx + 1}-${Date.now()}`,
      lineNumber: idx + 1,
      itemName: it.itemName.trim() || `ទំនិញទី ${idx + 1}`,
      category: it.category,
      unit: it.unit,
      qtyReference: Number(it.qtyReference) || 0,
      qtyActual: Number(it.qtyActual) || 0,
      unitPrice: Number(it.unitPrice) || 0,
      totalAmount: Number(it.totalAmount) || 0,
    }));

    const newVoucher: StockInVoucher = {
      voucherNumber: voucherNumber.trim().padStart(3, '0'),
      stockDate,
      receivedFrom,
      documentType,
      invoiceNumber,
      invoiceDate,
      enteredBy,
      organization,
      warehouse,
      fiscalYear,
      items: formattedItems,
      grandTotal,
    };

    onSave(newVoucher);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FilePlus2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-moul">បង្កើតប័ណ្ណបញ្ចូលសម្ភារៈថ្មី</h2>
              <p className="text-xs text-blue-200">បញ្ចូលទិន្នន័យប័ណ្ណ និងមុខទំនិញចូលឃ្លាំងសាលារៀន</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-blue-200 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50">
          {/* Metadata */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">លេខប័ណ្ណបញ្ចូល (Voucher No.)</label>
              <input
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-mono font-bold text-blue-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">កាលបរិច្ឆេទបញ្ជី (Date)</label>
              <input
                type="text"
                value={stockDate}
                onChange={(e) => setStockDate(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">អ្នកបញ្ចូលទិន្នន័យ (User)</label>
              <input
                type="text"
                value={enteredBy}
                onChange={(e) => setEnteredBy(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ប្រភេទសក្ខីបត្រ</label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">បានទទួលពី (អ្នកផ្គត់ផ្គង់)</label>
              <input
                type="text"
                value={receivedFrom}
                onChange={(e) => setReceivedFrom(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">លេខសក្ខីបត្រ/វិក្កយបត្រ</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="ឧ. 0035"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">កាលបរិច្ឆេទវិក្កយបត្រ</label>
              <input
                type="text"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                placeholder="10/Mar/2025"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:bg-white"
              />
            </div>
          </div>

          {/* Dynamic Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">មុខទំនិញ និងតម្លៃ ({items.length})</span>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-xs font-semibold bg-blue-700 text-white px-2.5 py-1 rounded hover:bg-blue-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>បន្ថែមជួរទំនិញ</span>
              </button>
            </div>

            <div className="p-3 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-600 font-semibold border-b border-slate-200 pb-2">
                    <th className="p-1 text-center w-8">#</th>
                    <th className="p-1 min-w-[200px]">ឈ្មោះសម្ភារៈ/ទំនិញ</th>
                    <th className="p-1 min-w-[150px]">ប្រភេទចំណាយ</th>
                    <th className="p-1 w-20">ឯកតា</th>
                    <th className="p-1 text-right w-20">ចំនួន</th>
                    <th className="p-1 text-right w-28">ថ្លៃឯកតា (៛)</th>
                    <th className="p-1 text-right w-32">សរុប (៛)</th>
                    <th className="p-1 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.itemName}
                          onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                          placeholder="ឈ្មោះទំនិញ..."
                          required
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </td>
                      <td className="p-1">
                        <select
                          value={row.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500"
                        >
                          {DEFAULT_CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <select
                          value={row.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500"
                        >
                          {DEFAULT_UNITS.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          min="1"
                          value={row.qtyActual}
                          onChange={(e) => {
                            handleItemChange(idx, 'qtyActual', e.target.value);
                            handleItemChange(idx, 'qtyReference', e.target.value);
                          }}
                          required
                          className="w-full p-1.5 text-right font-mono font-bold border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={row.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          required
                          className="w-full p-1.5 text-right font-mono border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-1 text-right font-mono font-bold text-blue-900">
                        {formatKHR(row.totalAmount)}
                      </td>
                      <td className="p-1 text-center">
                        <button
                          type="button"
                          disabled={items.length <= 1}
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 font-bold bg-slate-50">
                    <td colSpan={6} className="p-2 text-right text-slate-700">សរុបទឹកប្រាក់ប័ណ្ណ:</td>
                    <td className="p-2 text-right font-mono text-sm text-blue-950 font-bold">
                      {formatKHR(grandTotal)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>រក្សាទុកប័ណ្ណ (Save Voucher)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
