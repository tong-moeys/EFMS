import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VoucherList } from './components/VoucherList';
import { ItemCatalog } from './components/ItemCatalog';
import { BudgetAnalytics } from './components/BudgetAnalytics';
import { ActivityBudgetReport } from './components/ActivityBudgetReport';
import { HolidayCalendar } from './components/HolidayCalendar';
import { AIAssistant } from './components/AIAssistant';
import { VoucherDetailModal } from './components/VoucherDetailModal';
import { NewVoucherModal } from './components/NewVoucherModal';
import { OfficialPrintView } from './components/OfficialPrintView';
import { StockInVoucher } from './types/inventory';
import { 
  getSavedVouchers, 
  saveVouchers, 
  resetToDefault 
} from './data/inventoryStore';

export function App() {
  const [vouchers, setVouchers] = useState<StockInVoucher[]>(() => getSavedVouchers());
  const [activeTab, setActiveTab] = useState<'vouchers' | 'catalog' | 'analytics' | 'budget' | 'calendar'>('vouchers');
  const [selectedVoucher, setSelectedVoucher] = useState<StockInVoucher | null>(null);
  const [printVoucher, setPrintVoucher] = useState<StockInVoucher | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');

  // Sync to local storage
  useEffect(() => {
    saveVouchers(vouchers);
  }, [vouchers]);

  // Total Metrics
  const totalExpenditure = vouchers.reduce((sum, v) => sum + v.grandTotal, 0);
  const uniqueItemsCount = new Set(
    vouchers.flatMap(v => v.items.map(i => `${i.itemName.trim()}_${i.unit.trim()}`))
  ).size;

  const handleSelectVoucherByNumber = (vNum: string) => {
    const found = vouchers.find(v => v.voucherNumber === vNum);
    if (found) {
      setSelectedVoucher(found);
    }
  };

  const handleSaveNewVoucher = (newVoucher: StockInVoucher) => {
    const updated = [newVoucher, ...vouchers];
    setVouchers(updated);
    setIsNewModalOpen(false);
    setSelectedVoucher(newVoucher);
  };

  const handleResetData = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យដើមឡើងវិញមែនទេ? (Reset to original 20 vouchers)')) {
      const def = resetToDefault();
      setVouchers(def);
      setSelectedVoucher(null);
      setPrintVoucher(null);
    }
  };

  const nextVoucherNum = (vouchers.length + 1).toString().padStart(3, '0');

  // If in full print view
  if (printVoucher) {
    return (
      <OfficialPrintView
        voucher={printVoucher}
        onBack={() => setPrintVoucher(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Institutional Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewVoucher={() => setIsNewModalOpen(true)}
        onResetData={handleResetData}
        voucherCount={vouchers.length}
        itemCount={uniqueItemsCount}
        totalExpenditure={totalExpenditure}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {activeTab === 'vouchers' && (
          <VoucherList
            vouchers={vouchers}
            onSelectVoucher={(v) => setSelectedVoucher(v)}
            onPrintVoucher={(v) => setPrintVoucher(v)}
            onNewVoucher={() => setIsNewModalOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <ItemCatalog
            vouchers={vouchers}
            onSelectVoucherByNumber={handleSelectVoucherByNumber}
          />
        )}

        {activeTab === 'analytics' && (
          <BudgetAnalytics vouchers={vouchers} />
        )}

        {activeTab === 'budget' && (
          <ActivityBudgetReport />
        )}

        {activeTab === 'calendar' && (
          <HolidayCalendar />
        )}
      </main>

      <AIAssistant />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© ២០២៥ ប្រព័ន្ធគ្រប់គ្រងសម្ភារៈ និងស្តុកទំនិញ — សាលាបឋមសិក្សា រោគ</p>
          <p className="text-slate-400 font-mono">TongICT Inventory System • v1.0</p>
        </div>
      </footer>

      {/* View Detail Modal */}
      {selectedVoucher && (
        <VoucherDetailModal
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          onPrint={(v) => {
            setSelectedVoucher(null);
            setPrintVoucher(v);
          }}
        />
      )}

      {/* New Voucher Modal */}
      {isNewModalOpen && (
        <NewVoucherModal
          onClose={() => setIsNewModalOpen(false)}
          onSave={handleSaveNewVoucher}
          nextVoucherNumber={nextVoucherNum}
        />
      )}
    </div>
  );
}
