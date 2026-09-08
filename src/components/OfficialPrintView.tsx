import React from 'react';
import { StockInVoucher } from '../types/inventory';
import { formatKHR, formatNumber } from '../data/inventoryStore';
import { ArrowLeft, Printer } from 'lucide-react';

interface OfficialPrintViewProps {
  voucher: StockInVoucher;
  onBack: () => void;
}

export const OfficialPrintView: React.FC<OfficialPrintViewProps> = ({
  voucher,
  onBack,
}) => {
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Action Bar for screen view */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ក្រោយ (Back)</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            ចុចបោះពុម្ព ឬរក្សាទុកជា PDF (Ctrl + P)
          </span>
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>បោះពុម្ពប័ណ្ណ (Print / Save PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (A4 Paper emulation) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 text-sm">
        {/* National Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-center sm:text-left space-y-0.5 text-xs sm:text-sm font-hanuman">
            <p className="font-semibold text-slate-800">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            <p className="text-slate-700">មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តបន្ទាយមានជ័យ</p>
            <p className="text-slate-700">ការិយាល័យអប់រំ ស្រុកភ្នំស្រុក</p>
            <p className="font-bold text-blue-900 font-moul text-sm mt-1">
              សាលាបឋមសិក្សា រោគ
            </p>
          </div>

          <div className="text-center space-y-1">
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              ព្រះរាជាណាចក្រកម្ពុជា
            </p>
            <p className="font-moul text-xs sm:text-sm text-slate-900">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </p>
            <div className="w-16 h-0.5 bg-slate-800 mx-auto mt-1"></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h1 className="font-moul text-lg sm:text-xl text-blue-950">
            ប័ណ្ណបញ្ចូលសម្ភារៈ ទំនិញ
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            (សម្រាប់ប្រើប្រាស់ក្នុងអង្គភាពអប់រំសាធារណៈ)
          </p>
        </div>

        {/* Voucher Info Box */}
        <div className="border border-slate-400 rounded-md p-4 mb-6 text-xs bg-slate-50/40 print:bg-transparent">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-600">លេខប័ណ្ណបញ្ចូល:</span>{' '}
              <strong className="text-slate-900 font-mono text-sm">{voucher.voucherNumber}</strong>
            </div>
            <div>
              <span className="text-slate-600">កាលបរិច្ឆេទបញ្ជី:</span>{' '}
              <strong className="text-slate-900">{voucher.stockDate}</strong>
            </div>
            <div>
              <span className="text-slate-600">ឆ្នាំថវិកា:</span>{' '}
              <strong className="text-slate-900">{voucher.fiscalYear}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-600">បានទទួលពី:</span>{' '}
              <strong className="text-slate-900">{voucher.receivedFrom}</strong>
            </div>
            <div>
              <span className="text-slate-600">បញ្ចូលនៅឃ្លាំង:</span>{' '}
              <strong className="text-slate-900">{voucher.warehouse}</strong>
            </div>
            <div>
              <span className="text-slate-600">តាមសក្ខីបត្រ:</span>{' '}
              <strong className="text-slate-900">{voucher.documentType || 'Invoice'}</strong>
            </div>
            <div>
              <span className="text-slate-600">លេខសក្ខីបត្រ/វិក្កយបត្រ:</span>{' '}
              <strong className="text-slate-900 font-mono">{voucher.invoiceNumber || '—'}</strong>
            </div>
            <div>
              <span className="text-slate-600">កាលបរិច្ឆេទវិក្កយបត្រ:</span>{' '}
              <strong className="text-slate-900">{voucher.invoiceDate || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Table of Items */}
        <div className="mb-6 overflow-hidden">
          <table className="w-full text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400 print:bg-slate-100">
                <th className="py-2 px-2 text-center border border-slate-400 w-10">ល.រ</th>
                <th className="py-2 px-3 text-left border border-slate-400">ឈ្មោះសញ្ញា ក្បួន ខ្នាត បរិក្ខារ ទំនិញ</th>
                <th className="py-2 px-2 text-left border border-slate-400 w-36">ប្រភេទចំណាយ</th>
                <th className="py-2 px-2 text-center border border-slate-400 w-16">ឯកតា</th>
                <th className="py-2 px-2 text-right border border-slate-400 w-20">ចំនួនតាម<br />សក្ខីបត្រ</th>
                <th className="py-2 px-2 text-right border border-slate-400 w-20">ចំនួនបញ្ចូល<br />ពិតប្រាកដ</th>
                <th className="py-2 px-2 text-right border border-slate-400 w-24">ថ្លៃឯកតា (៛)</th>
                <th className="py-2 px-2 text-right border border-slate-400 w-28">សរុបទឹកប្រាក់ (៛)</th>
              </tr>
            </thead>
            <tbody>
              {voucher.items.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-400">
                  <td className="py-1.5 px-2 text-center border border-slate-400">{item.lineNumber}</td>
                  <td className="py-1.5 px-3 font-semibold border border-slate-400">{item.itemName}</td>
                  <td className="py-1.5 px-2 text-[11px] border border-slate-400">{item.category}</td>
                  <td className="py-1.5 px-2 text-center border border-slate-400">{item.unit}</td>
                  <td className="py-1.5 px-2 text-right font-mono border border-slate-400">{formatNumber(item.qtyReference)}</td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold border border-slate-400">{formatNumber(item.qtyActual)}</td>
                  <td className="py-1.5 px-2 text-right font-mono border border-slate-400">{formatNumber(item.unitPrice)}</td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold border border-slate-400">{formatNumber(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={7} className="py-2 px-3 text-right border border-slate-400">
                  សរុបទឹកប្រាក់រួមទាំងអស់ (Grand Total):
                </td>
                <td className="py-2 px-2 text-right font-mono text-sm font-bold border border-slate-400">
                  {formatKHR(voucher.grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Date and Signatures */}
        <div className="mt-8 text-xs font-hanuman">
          <div className="grid grid-cols-2 gap-10">
            {/* Left Signature */}
            <div className="text-center space-y-2">
              <p className="font-bold text-slate-900 font-moul text-sm">បានឃើញ និងឯកភាព</p>
              <div className="space-y-1">
                <p 
                  contentEditable suppressContentEditableWarning 
                  className="outline-none hover:bg-slate-50 focus:bg-slate-100 px-2 min-h-[1.5rem] rounded"
                >
                  ថ្ងៃ...................ខែ.....................ឆ្នាំមមី អដ្ឋស័ក ព.ស ២៥៧០
                </p>
                <p 
                  contentEditable suppressContentEditableWarning 
                  className="outline-none hover:bg-slate-50 focus:bg-slate-100 px-2 min-h-[1.5rem] rounded"
                >
                  ......................ថ្ងៃទី............ខែ............ឆ្នាំ២០២៦
                </p>
              </div>
              <p className="font-bold text-slate-900 font-moul text-sm mt-4">
                ប្រធានការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលក្រុង/ស្រុក
              </p>
            </div>

            {/* Right Signature */}
            <div className="text-center space-y-2">
              <p 
                contentEditable suppressContentEditableWarning 
                className="outline-none hover:bg-slate-50 focus:bg-slate-100 px-2 min-h-[1.5rem] rounded"
              >
                ថ្ងៃពុធ ២រោច ខែបឋមាសាឍ ឆ្នាំមមី អដ្ឋស័ក ព.ស ២៥៧០
              </p>
              <p 
                contentEditable suppressContentEditableWarning 
                className="outline-none hover:bg-slate-50 focus:bg-slate-100 px-2 min-h-[1.5rem] rounded"
              >
                រោគ ថ្ងៃទី១ ខែមិថុនា ឆ្នាំ២០២៦
              </p>
              <p className="font-bold text-slate-900 font-moul text-sm mt-4">
                នាយិកា
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
