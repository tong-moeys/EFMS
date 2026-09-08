import React from 'react';
import { 
  FileSpreadsheet, 
  Package, 
  BarChart3, 
  PlusCircle, 
  School,
  RotateCcw,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'vouchers' | 'catalog' | 'analytics' | 'budget' | 'calendar';
  setActiveTab: (tab: 'vouchers' | 'catalog' | 'analytics' | 'budget' | 'calendar') => void;
  onOpenNewVoucher: () => void;
  onResetData: () => void;
  voucherCount: number;
  itemCount: number;
  totalExpenditure: number;
  selectedYear: string;
  setSelectedYear: (yr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewVoucher,
  onResetData,
  voucherCount,
  itemCount,
  totalExpenditure,
  selectedYear,
  setSelectedYear,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Ministry / Institutional Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <School className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-xs tracking-wider text-amber-300 font-medium font-hanuman">
                ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white font-moul tracking-wide">
                ប្រព័ន្ធគ្រប់គ្រងសម្ភារៈ និងស្តុកទំនិញ
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white/10 border border-white/15 px-3 py-1 rounded-md">
              <span className="text-slate-300 mr-1.5">អង្គភាព:</span>
              <span className="font-semibold text-white">សាលាបឋមសិក្សា រោគ</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="text-slate-300">ឆ្នាំថវិកា:</span>
              <select
                id="fiscal-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="2025" className="bg-slate-800 text-white">២០២៥ (2025)</option>
                <option value="2024" className="bg-slate-800 text-white">២០២៤ (2024)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation & Quick Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200/80">
          <button
            id="tab-vouchers"
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'vouchers'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-640 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>បញ្ជីប័ណ្ណបញ្ចូលសម្ភារៈ</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
              {voucherCount}
            </span>
          </button>

          <button
            id="tab-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-640 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>សារពើភ័ណ្ឌទំនិញ</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              {itemCount}
            </span>
          </button>

          <button
            id="tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-640 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>ស្ថិតិ & របាយការណ៍</span>
          </button>

          <button
            id="tab-budget"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'budget'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-640 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            <span>ចំណាយថវិកា</span>
          </button>

          <button
            id="tab-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-640 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>ប្រតិទិន</span>
          </button>
        </nav>

        {/* Total Summary and Create Button */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex flex-col text-right pr-2">
            <span className="text-xs text-slate-500 font-medium">ទឹកប្រាក់ចំណាយសរុប</span>
            <span className="text-sm font-bold text-blue-900">
              {new Intl.NumberFormat('km-KH').format(totalExpenditure)} ៛
            </span>
          </div>

          <button
            id="btn-new-voucher"
            onClick={onOpenNewVoucher}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>បង្កើតប័ណ្ណថ្មី</span>
          </button>

          <button
            id="btn-reset-data"
            onClick={onResetData}
            title="កំណត់ទិន្នន័យឡើងវិញ (Reset to Original)"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
